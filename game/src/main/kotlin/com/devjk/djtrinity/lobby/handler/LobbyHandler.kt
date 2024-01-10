package com.devjk.djtrinity.lobby.handler

import com.devjk.djtrinity.framework.common.BaseSocketHandler
import com.devjk.djtrinity.framework.common.SessionHandler
import com.devjk.djtrinity.framework.utils.JwtProvider
import com.devjk.djtrinity.lobby.message.LobbyMessage
import com.devjk.djtrinity.lobby.service.LobbyService
import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.WebSocketMessage
import org.springframework.web.socket.WebSocketSession

@Component
class LobbyHandler(
    private val redisTemplate: RedisTemplate<String, Any>,
    private val objectMapper: ObjectMapper,
    private val lobbyService: LobbyService,
    jwtProvider: JwtProvider,
    sessionHandler: SessionHandler
) : BaseSocketHandler(
    redisTemplate, jwtProvider, sessionHandler
) {
    private val log = LoggerFactory.getLogger(this.javaClass)

    override fun afterConnectionEstablished(session: WebSocketSession) {
        log.debug("LobbyHandler : afterConnectionEstablished : {}", session)
    }

    override fun handleMessage(session: WebSocketSession, message: WebSocketMessage<*>) {
        log.debug("handleMessage : {} / session : {}", message.payload, session)
        try {
            val lobbyMessage =
                objectMapper.readValue(message.payload.toString(), LobbyMessage::class.java)

            if (lobbyMessage.isAuthorization()) {
                authorize(session, lobbyMessage)
                return
            }

            if (lobbyMessage.isEnterChannel()) {
                val userId = getUserId(session)
                lobbyService.enterChannel(session, userId)
                return
            }

            if (lobbyMessage.isChatMessage()) {
                val userId = getUserId(session)
                lobbyService.sendChatMessage(session, userId, lobbyMessage)
                return
            }


        } catch (e: Exception) {
            e.printStackTrace()
            log.debug("fail to process message : {} / session : {}", message, session)
            session.close(CloseStatus.NOT_ACCEPTABLE)
        }
    }

    override fun handleTransportError(session: WebSocketSession, exception: Throwable) {
        log.debug("LobbyHandler : handleTransportError : {} / session : {}", exception, session)
    }

    override fun afterConnectionClosed(session: WebSocketSession, closeStatus: CloseStatus) {
        log.debug("LobbyHandler : afterConnectionClosed : {} / session : {}", closeStatus, session)
        val ops = redisTemplate.opsForHash<String, String>()
        ops.delete("Authorization", session.id)
        lobbyService.exitChannel(session)
        sessionHandler.remove(session.id)
    }

    override fun supportsPartialMessages(): Boolean {
        return false
    }

}