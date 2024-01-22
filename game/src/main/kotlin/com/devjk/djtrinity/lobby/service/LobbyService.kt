package com.devjk.djtrinity.lobby.service

import com.devjk.djtrinity.common.UserStatus
import com.devjk.djtrinity.framework.common.RedisHandler
import com.devjk.djtrinity.framework.common.SessionHandler
import com.devjk.djtrinity.framework.utils.TrinityApiUtils
import com.devjk.djtrinity.lobby.message.LobbyMessage
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.convertValue
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.web.socket.WebSocketSession
import java.time.LocalDateTime

@Service
class LobbyService(
    private val redisHandler: RedisHandler,
    private val sessionHandler: SessionHandler,
    private val trinityApiUtils: TrinityApiUtils,
    private val objectMapper: ObjectMapper
) {
    private val log = LoggerFactory.getLogger(this.javaClass)

    companion object {
        const val MAX_USERS_IN_CHANNEL = 20
    }

    fun enterChannel(session: WebSocketSession, userId: String) {
        val channelId = findAvailableChannel()

        // user status
        redisHandler.put(
            "UserStatus", session.id, UserStatus(
                userId = userId,
                currentChannel = channelId
            )
        )

        // channel
        redisHandler.put(channelId, session.id, userId)
        val users = redisHandler.entries(channelId).values.toList()
        session.sendMessage(LobbyMessage.ofEnterChannel(channelId, users = users).toPong())

        // publish
        redisHandler.convertAndSend(
            channelId,
            LobbyMessage.ofEnterChannel(channelId, userId, users)
        )
    }

    fun exitChannel(session: WebSocketSession) {
        redisHandler.get("UserStatus", session.id, UserStatus::class.java)?.let { userStatus ->
            userStatus.currentChannel?.let { channelId ->
                redisHandler.delete(channelId, session.id)
            }
            redisHandler.delete("UserStatus", session.id)

            // channel
            val users = redisHandler.entries(userStatus.currentChannel!!).values.toList()

            // publish
            redisHandler.convertAndSend(
                userStatus.currentChannel!!,
                LobbyMessage.ofExitChannel(
                    channelId = userStatus.currentChannel,
                    userId = userStatus.userId,
                    users = users
                )
            )
        }
    }


    fun sendChatMessage(session: WebSocketSession, userId: String, lobbyMessage: LobbyMessage) {
        val chatMessageData = lobbyMessage.payload as LinkedHashMap<*, *>
        val message = chatMessageData["message"].toString()

        redisHandler.get("UserStatus", session.id, UserStatus::class.java)?.let { userStatus ->
            userStatus.currentChannel?.let { channelId ->
                redisHandler.convertAndSend(
                    channelId,
                    LobbyMessage.ofChatMessage(
                        chatType = LobbyMessage.ChatMessageData.ChatType.NORMAL,
                        nickname = chatMessageData["nickname"].toString(),
                        userId = userId,
                        message = message,
                        channelId = channelId
                    )
                )
            }
        }
    }

    private fun findAvailableChannel(): String {
        // todo channel 추가/삭제/조회 시 global lock 을 잡는 것이 좋을 듯 하다.
        // todo channel 이 커지면 클래스로 분리하는 것이 좋을 듯 하다.
        return "channel_1"
    }

    fun publishUserEntered(lobbyMessage: LobbyMessage) {

        // fixme -> 직렬화 잘 할것... 클래스로, 지금 user 의 arrayList 가 직렬화가 안됨.
        //        val enterChannelData = lobbyMessage.payload!!.let {
//            objectMapper.convertValue<LobbyMessage.EnterChannelData>(it)
//        }
        val enterChannelData =
            objectMapper.convertValue<LobbyMessage.EnterChannelData>(lobbyMessage.payload!!)
        val sessionIds = redisHandler.entries(enterChannelData.channelId!!).keys

        // send enter channel message
        sessionIds.forEach { sessionId ->
            val session = sessionHandler.get(sessionId)
            session?.sendMessage(
                LobbyMessage.ofEnterChannel(
                    channelId = enterChannelData.channelId,
                    userId = enterChannelData.userId,
                    users = enterChannelData.users
                ).toPong()
            )
        }

        // send system message
        sessionIds.forEach { sessionId ->
            trinityApiUtils.getUserInfo(enterChannelData.userId!!)
                .subscribe { userInfo ->
                    val nickname = userInfo["nickname"].asText()
                    val session = sessionHandler.get(sessionId)
                    session?.sendMessage(
                        LobbyMessage.ofChatMessage(
                            chatType = LobbyMessage.ChatMessageData.ChatType.SYSTEM,
                            message = "$nickname Entered.",
                            sendTime = LocalDateTime.now()
                        ).toPong()
                    )
                }
        }
    }

    fun publishUserExited(lobbyMessage: LobbyMessage) {
        val exitChannelData =
            objectMapper.convertValue<LobbyMessage.ExitChannelData>(lobbyMessage.payload!!)
        val sessionIds = redisHandler.entries(exitChannelData.channelId!!).keys

        // send exit channel message
        sessionIds.forEach { sessionId ->
            val session = sessionHandler.get(sessionId)
            session?.sendMessage(
                LobbyMessage.ofExitChannel(
                    channelId = exitChannelData.channelId,
                    userId = exitChannelData.userId,
                    users = exitChannelData.users
                ).toPong()
            )
        }

        // send system message
        trinityApiUtils.getUserInfo(exitChannelData.userId!!)
            .subscribe { userInfo ->
                sessionIds.forEach { sessionId ->
                    val nickname = userInfo["nickname"].asText()
                    val session = sessionHandler.get(sessionId)
                    session?.sendMessage(
                        LobbyMessage.ofChatMessage(
                            chatType = LobbyMessage.ChatMessageData.ChatType.SYSTEM,
                            message = "$nickname Exited.",
                            sendTime = LocalDateTime.now()
                        ).toPong()
                    )
                }
            }
    }

    fun publishChatMessage(lobbyMessage: LobbyMessage) {
        val messageData =
            objectMapper.convertValue<LobbyMessage.ChatMessageData>(lobbyMessage.payload!!)
        val sessionIds = redisHandler.entries(messageData.channelId!!).keys

        sessionIds.forEach { sessionId ->
            sessionHandler.get(sessionId)?.sendMessage(
                LobbyMessage.ofChatMessage(
                    chatType = messageData.chatType,
                    nickname = messageData.nickname,
                    userId = messageData.userId,
                    message = messageData.message,
                    sendTime = LocalDateTime.now(),
                ).toPong()
            )
        }
    }
}