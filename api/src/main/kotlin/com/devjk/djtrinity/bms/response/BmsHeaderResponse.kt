package com.devjk.djtrinity.bms.response

import com.devjk.djtrinity.domain.BmsHeader
import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.google.gson.Gson

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
data class BmsHeaderResponse(
    private val id: Long,
    val bmsHeader: BmsHeader
) {
    constructor() : this(0, BmsHeader())

    override fun toString(): String {
        return Gson().toJson(this)
    }
}