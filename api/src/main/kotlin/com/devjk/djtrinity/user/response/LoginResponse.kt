package com.devjk.djtrinity.user.response

import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.google.gson.Gson


@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
class LoginResponse(
    val token: String
) {
    override fun toString(): String {
        return Gson().toJson(this)
    }
}