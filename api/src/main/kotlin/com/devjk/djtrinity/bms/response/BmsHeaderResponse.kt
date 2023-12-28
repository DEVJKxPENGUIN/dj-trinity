package com.devjk.djtrinity.bms.response

import com.devjk.djtrinity.domain.BmsHeader
import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.google.gson.Gson

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
data class BmsHeaderResponse(
    private val id: Long,
    private val bmsHeader: BmsHeader
) {
    override fun toString(): String {
        return Gson().toJson(this)
    }
}