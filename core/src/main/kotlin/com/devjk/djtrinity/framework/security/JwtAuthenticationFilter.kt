package com.devjk.djtrinity.framework.security

import com.devjk.djtrinity.framework.utils.JwtProvider
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
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
    private val jwtProvider: JwtProvider
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = getTokenFromHeader(request)
        token?.let {
            try {
                val userId = jwtProvider.getUserIdFromToken(token)
                UsernamePasswordAuthenticationToken.authenticated(
                    userId,
                    token,
                    listOf(SimpleGrantedAuthority("user"))
                )
                    .apply { details = WebAuthenticationDetails(request) }
                    .also { SecurityContextHolder.getContext().authentication = it }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        filterChain.doFilter(request, response)
    }

    private fun getTokenFromHeader(request: HttpServletRequest): String? {
        return request.getHeader(HttpHeaders.AUTHORIZATION)
            .takeIf { it?.startsWith("Bearer ", true) ?: false }
            ?.substring(7)
    }
}