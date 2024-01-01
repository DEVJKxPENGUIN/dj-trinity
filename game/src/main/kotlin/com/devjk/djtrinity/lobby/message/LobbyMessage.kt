package com.devjk.djtrinity.lobby.message

import com.devjk.djtrinity.common.MessageType
import com.devjk.djtrinity.framework.common.BaseMessage
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.gson.Gson
import org.springframework.web.socket.TextMessage
import java.time.LocalDateTime

class LobbyMessage(
    type: MessageType,
    token: String? = null,
    val payload: Any? = null
) : BaseMessage(type, token) {

    companion object {
        fun ofEnterChannel(
            channelId: String? = null,
            userId: String? = null,
            users: List<String>? = listOf()
        ): LobbyMessage {
            return LobbyMessage(
                type = MessageType.ENTER_CHANNEL,
                payload = EnterChannelData(channelId, userId, users)
            )
        }

        fun ofChatMessage(
            chatType: ChatMessageData.ChatType,
            nickname: String? = null,
            userId: String? = null,
            message: String,
            sendTime: LocalDateTime? = null
        ): LobbyMessage {
            return LobbyMessage(
                type = MessageType.CHAT_MESSAGE,
                payload = ChatMessageData(
                    chatType = chatType,
                    nickname = nickname,
                    userId = userId,
                    message = message,
                    sendTime = sendTime?.toString()
                )
            )
        }
    }

    data class EnterChannelData(
        val channelId: String?,
        val userId: String?,
        val users: List<String>?
    )

    data class ChatMessageData(
        val chatType: ChatType,
        val nickname: String?,
        val userId: String?,
        val message: String,
        val sendTime: String?
    ) {
        init {
            if (chatType == ChatType.NORMAL) {
                require(nickname != null) { "nickname must not be null" }
                require(userId != null) { "userId must not be null" }
            }
        }

        enum class ChatType(val description: String) {
            NORMAL("일반 채팅"),
            SYSTEM("시스템"),
        }
    }

    fun isEnterChannel(): Boolean {
        return type == MessageType.ENTER_CHANNEL
    }

    fun toPong(): TextMessage {
        return TextMessage(Gson().toJson(this))
    }

    override fun toString(): String {
        return ObjectMapper().writeValueAsString(this)
    }
}
