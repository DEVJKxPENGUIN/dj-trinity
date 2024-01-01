package com.devjk.djtrinity.framework.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.client.WebClient

@Configuration
class WebClientConfig(
    @Value("\${api-server-host}")
    private val apiServerHost: String,
    @Value("\${server-to-server-key}")
    private val serverToServerKey: String
) {
    @Bean
    fun apiWebClient(): WebClient {
        return WebClient
            .builder()
            .baseUrl(apiServerHost)
            .defaultHeaders {
                it.set("Content-Type", "application/json")
                it.set("Accept", "application/json")
                it.set("Authorization", "Bearer $serverToServerKey")
            }
            .build()
    }

}