package com.devjk.djtrinity.framework.filter

import com.devjk.djtrinity.framework.utils.JwtProvider
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.annotation.Order
import org.springframework.http.HttpHeaders
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetails
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Order(0)
@Component
class JwtAuthenticationFilter(
    private val jwtProvider: JwtProvider,
    @Value("\${server-to-server-key}")
    private val serverToServerKey: String
) : OncePerRequestFilter() {
    private val log = LoggerFactory.getLogger(this.javaClass)

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = getTokenFromHeader(request)
        token?.let {
            try {

                if (token == serverToServerKey) {
                    authenticate(token, "server-to-server", "server-to-server", request)
                } else {
                    val userId = jwtProvider.getUserIdFromToken(token)
                    log.debug("Jwt Filter : token :  {} / userId :  {}", token, userId)
                    authenticate(token, userId, "user", request)
                }

            } catch (e: Exception) {
                e.printStackTrace()
            }
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