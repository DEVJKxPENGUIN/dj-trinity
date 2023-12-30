package com.devjk.djtrinity.framework.common

import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException
import com.devjk.djtrinity.framework.utils.JwtProvider
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.WebSocketSession
import java.util.concurrent.ConcurrentHashMap

abstract class BaseSocketHandler(
    private val redisTemplate: RedisTemplate<String, Any>,
    private val jwtProvider: JwtProvider,
) : WebSocketHandler {
    private val log = org.slf4j.LoggerFactory.getLogger(this.javaClass)

    companion object {
        private val sessions = ConcurrentHashMap<String, WebSocketSession>()
    }

    fun authorize(session: WebSocketSession, message: BaseMessage) {
        val ops = redisTemplate.opsForHash<String, String>()
        if (message.isAuthorization()) {
            val userId = jwtProvider.getUserIdFromToken(message.token!!)
            ops.put("Authorization", session.id, userId)
            sessions[session.id] = session
        }
    }

    fun getUserId(session: WebSocketSession): String {
        val ops = redisTemplate.opsForHash<String, String>()
        return ops.get("Authorization", session.id)
            ?: throw BaseException(ErrorCode.AUTHENTICATION_EXPIRED)
    }

    fun hasSession(sessionId: String): Boolean {
        return sessions.contains(sessionId)
    }

    fun getSession(sessionId: String): WebSocketSession? {
        return sessions[sessionId]
    }

    fun removeSession(sessionId: String) {
        sessions.remove(sessionId)
    }
}