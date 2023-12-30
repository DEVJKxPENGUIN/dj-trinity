package com.devjk.djtrinity.common

import com.fasterxml.jackson.databind.ObjectMapper

class UserStatus(
    var userId: String? = null,
    var currentChannel: String? = null
) {

    companion object {
        fun of(json: String): UserStatus {
            return ObjectMapper().readValue(json, UserStatus::class.java)
        }
    }

    override fun toString(): String {
        return ObjectMapper().writeValueAsString(this)
    }
}