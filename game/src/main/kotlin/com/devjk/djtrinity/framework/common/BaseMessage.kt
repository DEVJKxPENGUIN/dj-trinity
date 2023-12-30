package com.devjk.djtrinity.framework.common

import com.devjk.djtrinity.common.MessageType

open class BaseMessage(
    val type: MessageType,
    val token: String? = null
) {
    init {
        if (type == MessageType.AUTHORIZATION) {
            requireNotNull(token)
        }
    }

    fun isAuthorization(): Boolean {
        return type == MessageType.AUTHORIZATION
    }
}