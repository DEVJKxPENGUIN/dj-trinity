package com.devjk.djtrinity.bms.response

import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.google.gson.Gson

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
class FFMpegConvertResult(
    private val targetCount: Int = 0,
    private val cachedCount: Int = 0,
    private val convertedCount: Int = 0,
    private val failedCount: Int = 0
) {

    override fun toString(): String {
        return Gson().toJson(this)
    }
}