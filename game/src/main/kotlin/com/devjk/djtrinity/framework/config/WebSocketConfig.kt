package com.devjk.djtrinity.framework.config

import com.devjk.djtrinity.lobby.handler.LobbyHandler
import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry

@Configuration
@EnableWebSocket
class WebSocketConfig(
    private val lobbyHandler: LobbyHandler
) : WebSocketConfigurer {
    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        registry.addHandler(lobbyHandler, "/ws/lobby")
            .setAllowedOrigins("http://localhost:5001")
    }
}