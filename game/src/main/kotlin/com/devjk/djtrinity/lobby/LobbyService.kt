package com.devjk.djtrinity.lobby

import com.devjk.djtrinity.common.UserStatus
import com.devjk.djtrinity.lobby.message.LobbyMessage
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import org.springframework.web.socket.WebSocketSession

@Service
class LobbyService(
    private val redisTemplate: RedisTemplate<String, Any>,
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
        session.sendMessage(LobbyMessage.ofEnterChannel(channelId).toPong())
        publishEnterChannel(channelId)
    }

    fun exitChannel(session: WebSocketSession) {
        val ops = redisTemplate.opsForHash<String, Any>()
        ops.get("UserStatus", session.id)?.let { userStatus ->
            userStatus as UserStatus
            userStatus.currentChannel?.let { channelId ->
                ops.delete(channelId, session.id)
            }
            ops.delete("UserStatus", session.id)
        }
    }

    fun findAvailableChannel(): String {
        // todo channel 추가/삭제/조회 시 global lock 을 잡는 것이 좋을 듯 하다.
        // todo channel 이 커지면 클래스로 분리하는 것이 좋을 듯 하다.
        return "channel_1"
    }

    fun publishEnterChannel(channelId: String) {
        // todo channel 에 있는 모든 session 에게 message 를 publish 하는 것이 좋을 듯 하다.


    }


}