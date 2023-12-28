package com.devjk.djtrinity.user.response

import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.google.gson.Gson

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
data class UserResponse(
    val id: String,
    val nickname: String,
    val profile: String?
) {
    override fun toString(): String {
        return Gson().toJson(this)
    }
}