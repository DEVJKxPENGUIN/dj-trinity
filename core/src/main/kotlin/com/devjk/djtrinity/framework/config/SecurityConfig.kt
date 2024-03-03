package com.devjk.djtrinity.framework.config

import com.devjk.djtrinity.framework.filter.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter

@Configuration
@EnableMethodSecurity
class SecurityConfig(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter,
) {

    companion object {
        val PUBLIC_URLS = arrayOf(
            "/public/**",
            "/auth/**",
            "/ws/**",
            "/bms/sync",
            "/download/**",
        )
    }

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .authorizeHttpRequests {
                PUBLIC_URLS.forEach { path ->
                    it.requestMatchers(path).permitAll()
                }
                it.anyRequest().authenticated()
            }
            .cors {}
            .httpBasic { it.disable() }
            .formLogin { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .addFilterBefore(jwtAuthenticationFilter, BasicAuthenticationFilter::class.java)
        return http.build()
    }

    @Bean
    fun bCryptPasswordEncoder() = BCryptPasswordEncoder()
}