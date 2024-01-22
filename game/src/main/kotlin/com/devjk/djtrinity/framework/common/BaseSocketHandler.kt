package com.devjk.djtrinity.framework.common

import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException
import com.devjk.djtrinity.framework.utils.JwtProvider
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.WebSocketSession

abstract class BaseSocketHandler(
    private val redisHandler: RedisHandler,
    private val jwtProvider: JwtProvider,
    val sessionHandler: SessionHandler
) : WebSocketHandler {
    private val log = org.slf4j.LoggerFactory.getLogger(this.javaClass)

    fun authorize(session: WebSocketSession, message: BaseMessage) {
        if (message.isAuthorization()) {
            val userId = jwtProvider.getUserIdFromToken(message.token!!)
            redisHandler.put("Authorization", session.id, userId)
            sessionHandler.put(session.id, session)
        }
    }

    fun getUserId(session: WebSocketSession): String {
        return redisHandler.get("Authorization", session.id, String::class.java)
            ?: throw BaseException(ErrorCode.AUTHENTICATION_EXPIRED)
    }
}