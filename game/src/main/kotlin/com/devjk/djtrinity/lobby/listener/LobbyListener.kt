package com.devjk.djtrinity.lobby.listener

import com.devjk.djtrinity.lobby.message.LobbyMessage
import com.devjk.djtrinity.lobby.service.LobbyService
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.slf4j.LoggerFactory
import org.springframework.data.redis.connection.Message
import org.springframework.data.redis.connection.MessageListener
import org.springframework.stereotype.Service

@Service
class LobbyListener(
    private val lobbyService: LobbyService,
    private val objectMapper: ObjectMapper
) : MessageListener {
    private val log = LoggerFactory.getLogger(this.javaClass)
    override fun onMessage(message: Message, pattern: ByteArray?) {

        log.debug("LobbyListener : onMessage : {} / pattern : {}", message, pattern)

        val lobbyMessage = objectMapper.readValue<LobbyMessage>(message.body)
        if (lobbyMessage.isEnterChannel()) {
            lobbyService.publishUserEntered(lobbyMessage)
            return
        }

        if(lobbyMessage.isExitChannel()) {
            lobbyService.publishUserExited(lobbyMessage)
            return
        }

        if(lobbyMessage.isChatMessage()) {
            lobbyService.publishChatMessage(lobbyMessage)
            return
        }

    }
}