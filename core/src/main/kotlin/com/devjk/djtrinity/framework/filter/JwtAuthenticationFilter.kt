package com.devjk.djtrinity.framework.filter

import com.devjk.djtrinity.framework.common.BaseResponse
import com.devjk.djtrinity.framework.config.SecurityConfig.Companion.PUBLIC_URLS
import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.utils.JwtProvider
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.annotation.Order
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetails
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Order(0)
@Component
class JwtAuthenticationFilter(
    private val jwtProvider: JwtProvider,
    @Value("\${server-to-server-key}")
    private val serverToServerKey: String,
    private val objectMapper: ObjectMapper,
) : OncePerRequestFilter() {
    private val log = LoggerFactory.getLogger(this.javaClass)

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {

        PUBLIC_URLS.forEach { path ->
            val isNoAuthentication = AntPathRequestMatcher(path)
                .matches(request)

            if (isNoAuthentication) {
                filterChain.doFilter(request, response)
                return
            }
        }

        try {
            val token = getTokenFromHeader(request)
            token!!.let {
                if (token == serverToServerKey) {
                    authenticate(token, "server-to-server", "server-to-server", request)
                } else {
                    val userId = jwtProvider.getUserIdFromToken(token)
                    log.debug("Jwt Filter : token :  {} / userId :  {}", token, userId)
                    authenticate(token, userId, "user", request)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            val errorCode = ErrorCode.AUTHENTICATION_EXPIRED
            val body =
                objectMapper.writeValueAsString(BaseResponse.error(errorCode, errorCode.message))
            response.status = errorCode.httpStatus.value()
            response.contentType = APPLICATION_JSON.type
            response.writer.write(body)
            return
        }

        filterChain.doFilter(request, response)
    }

    private fun authenticate(
        token: String,
        principal: String,
        authority: String,
        request: HttpServletRequest
    ) {
        UsernamePasswordAuthenticationToken.authenticated(
            principal,
            token,
            listOf(SimpleGrantedAuthority(authority))
        )
            .apply { details = WebAuthenticationDetails(request) }
            .also { SecurityContextHolder.getContext().authentication = it }
    }

    private fun getTokenFromHeader(request: HttpServletRequest): String? {
        return request.getHeader(HttpHeaders.AUTHORIZATION)
            .takeIf { it?.startsWith("Bearer ", true) ?: false }
            ?.substring(7)
    }
}