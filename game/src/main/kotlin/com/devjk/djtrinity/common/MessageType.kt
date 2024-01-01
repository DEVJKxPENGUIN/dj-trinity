package com.devjk.djtrinity.common

enum class MessageType(val description: String) {
    AUTHORIZATION("웹소켓 인증"),
    ENTER_CHANNEL("채널 입장"),
    CHAT_MESSAGE("채팅 메시지"),
}