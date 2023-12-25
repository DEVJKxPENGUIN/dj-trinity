package com.devjk.djtrinity.bms.response

import com.devjk.djtrinity.domain.Bms
import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.google.gson.Gson

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
data class BmsResponse(
    val bms: Bms
) {
    override fun toString(): String {
        return Gson().toJson(this)
    }
}