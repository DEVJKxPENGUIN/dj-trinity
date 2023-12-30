package com.devjk.djtrinity.lobby.message

import com.devjk.djtrinity.common.MessageType
import com.devjk.djtrinity.framework.common.BaseMessage
import com.google.gson.Gson
import org.springframework.web.socket.TextMessage

class LobbyMessage(
    type: MessageType,
    token: String? = null,
    val payload: Any? = null
) : BaseMessage(type, token) {

    companion object {
        fun ofEnterChannel(channelId: String): LobbyMessage {
            return LobbyMessage(
                type = MessageType.ENTER_CHANNEL,
                payload = EnterChannelData(channelId)
            )
        }
    }

    data class EnterChannelData(
        val channelId: String
    )

    fun isEnterChannel(): Boolean {
        return type == MessageType.ENTER_CHANNEL
    }

    fun toPong(): TextMessage {
        return TextMessage(Gson().toJson(this))
    }
}
