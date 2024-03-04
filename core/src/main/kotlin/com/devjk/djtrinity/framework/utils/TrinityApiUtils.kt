package com.devjk.djtrinity.framework.utils

import com.fasterxml.jackson.databind.JsonNode
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

@Service
class TrinityApiUtils(
    private val apiWebClient: WebClient,
) {

    fun getUserInfo(userId: String): Mono<JsonNode> {
        return apiWebClient.get()
            .uri("/auth/user/$userId")
            .retrieve()
            .onStatus({ it.is4xxClientError || it.is5xxServerError }) {
                Mono.error(RuntimeException("API Server Error"))
            }
            .bodyToMono(JsonNode::class.java)
            .map { it.get("data") }
    }

}