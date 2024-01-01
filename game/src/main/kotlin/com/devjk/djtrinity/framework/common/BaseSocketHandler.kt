package com.devjk.djtrinity.framework.common

import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException
import com.devjk.djtrinity.framework.utils.JwtProvider
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.WebSocketSession

abstract class BaseSocketHandler(
    private val redisTemplate: RedisTemplate<String, Any>,
    private val jwtProvider: JwtProvider,
    val sessionHandler: SessionHandler
) : WebSocketHandler {
    private val log = org.slf4j.LoggerFactory.getLogger(this.javaClass)


    fun authorize(session: WebSocketSession, message: BaseMessage) {
        val ops = redisTemplate.opsForHash<String, String>()
        if (message.isAuthorization()) {
            val userId = jwtProvider.getUserIdFromToken(message.token!!)
            ops.put("Authorization", session.id, userId)
            sessionHandler.put(session.id, session)
        }
    }

    fun getUserId(session: WebSocketSession): String {
        val ops = redisTemplate.opsForHash<String, String>()
        return ops.get("Authorization", session.id)
            ?: throw BaseException(ErrorCode.AUTHENTICATION_EXPIRED)
    }
}