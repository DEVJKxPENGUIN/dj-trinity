package com.devjk.djtrinity.lobby.service

import com.devjk.djtrinity.common.UserStatus
import com.devjk.djtrinity.framework.common.SessionHandler
import com.devjk.djtrinity.framework.utils.TrinityApiUtils
import com.devjk.djtrinity.lobby.message.LobbyMessage
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import org.springframework.web.socket.WebSocketSession
import java.time.LocalDateTime

@Service
class LobbyService(
    private val redisTemplate: RedisTemplate<String, Any>,
    private val sessionHandler: SessionHandler,
    private val trinityApiUtils: TrinityApiUtils,
    private val objectMapper: ObjectMapper
) {
    companion object {
        const val MAX_USERS_IN_CHANNEL = 20
    }

    fun enterChannel(session: WebSocketSession, userId: String) {
        val channelId = findAvailableChannel()
        val ops = redisTemplate.opsForHash<String, Any>()

        // user status
        ops.put(
            "UserStatus", session.id, UserStatus(
                userId = userId,
                currentChannel = channelId
            )
        )

        // channel
        ops.put(channelId, session.id, userId)
        val users = ops.entries(channelId).values.map { it as String }.toList()
        session.sendMessage(LobbyMessage.ofEnterChannel(channelId, users = users).toPong())

        // publish
        redisTemplate.convertAndSend(
            channelId,
            LobbyMessage.ofEnterChannel(channelId, userId, users)
        )

    }

    fun exitChannel(session: WebSocketSession) {
        val ops = redisTemplate.opsForHash<String, Any>()
        ops.get("UserStatus", session.id)?.let { userStatus ->
            userStatus as UserStatus
            userStatus.currentChannel?.let { channelId ->
                ops.delete(channelId, session.id)
            }
            ops.delete("UserStatus", session.id)

            // channel
            val users =
                ops.entries(userStatus.currentChannel!!).values.map { it as String }.toList()

            // publish
            redisTemplate.convertAndSend(
                userStatus.currentChannel!!,
                LobbyMessage.ofExitChannel(
                    channelId = userStatus.currentChannel,
                    userId = userStatus.userId,
                    users = users
                )
            )
        }
    }

    fun findAvailableChannel(): String {
        // todo channel 추가/삭제/조회 시 global lock 을 잡는 것이 좋을 듯 하다.
        // todo channel 이 커지면 클래스로 분리하는 것이 좋을 듯 하다.
        return "channel_1"
    }

    fun publishUserEntered(lobbyMessage: LobbyMessage) {

        // fixme -> 직렬화 잘 할것... 클래스로, 지금 user 의 arrayList 가 직렬화가 안됨.
        //        val enterChannelData = lobbyMessage.payload!!.let {
//            objectMapper.convertValue<LobbyMessage.EnterChannelData>(it)
//        }
        val enterChannelData = lobbyMessage.payload as LinkedHashMap<*, *>

        val ops = redisTemplate.opsForHash<String, String>()
        val sessionIds = ops.entries(enterChannelData["channelId"].toString()).keys

        // send enter channel message
        sessionIds.forEach { sessionId ->
            val session = sessionHandler.get(sessionId)
            session?.sendMessage(
                LobbyMessage.ofEnterChannel(
                    channelId = enterChannelData["channelId"].toString(),
                    userId = enterChannelData["userId"].toString(),
                    users = enterChannelData["users"] as List<String>
                ).toPong()
            )
        }

        // send system message
        sessionIds.forEach { sessionId ->
            trinityApiUtils.getUserInfo(enterChannelData["userId"].toString())
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
        val exitChannelData = lobbyMessage.payload as LinkedHashMap<*, *>

        val ops = redisTemplate.opsForHash<String, String>()
        val sessionIds = ops.entries(exitChannelData["channelId"].toString()).keys

        // send exit channel message
        sessionIds.forEach { sessionId ->
            val session = sessionHandler.get(sessionId)
            session?.sendMessage(
                LobbyMessage.ofExitChannel(
                    channelId = exitChannelData["channelId"].toString(),
                    userId = exitChannelData["userId"].toString(),
                    users = exitChannelData["users"] as List<String>
                ).toPong()
            )
        }

        // send system mesage
        sessionIds.forEach { sessionId ->
            trinityApiUtils.getUserInfo(exitChannelData["userId"].toString())
                .subscribe { userInfo ->
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
}