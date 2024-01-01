package com.devjk.djtrinity.framework.common

import org.springframework.stereotype.Component
import org.springframework.web.socket.WebSocketSession
import java.util.concurrent.ConcurrentHashMap

@Component
class SessionHandler {

    companion object {
        private val sessions = ConcurrentHashMap<String, WebSocketSession>()
    }

    fun put(sessionId: String, session: WebSocketSession) {
        sessions[sessionId] = session
    }


    fun has(sessionId: String): Boolean {
        return sessions.contains(sessionId)
    }

    fun get(sessionId: String): WebSocketSession? {
        return sessions[sessionId]
    }

    fun remove(sessionId: String) {
        sessions.remove(sessionId)
    }
}