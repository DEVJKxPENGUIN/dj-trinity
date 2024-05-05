package com.devjk.djtrinity.domain

import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.google.gson.Gson

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
class Bms private constructor(header: String, data: String) {
    private val bmsHeader: BmsHeader = BmsHeader.fromAll(header)
    private val bmsData: ArrayList<BmsData> = arrayListOf()

    companion object {
        val HEADER_FIELD = "*---------------------- HEADER FIELD"
        val MAIN_DATA_FIELD = "*---------------------- MAIN DATA FIELD"
        val SOUND_EXTENSIONS = arrayOf("wav", "ogg")
        val BMS_EXTENSIONS = arrayOf("bms", "bme")
        fun parse(header: String, data: String): Bms {
            return Bms(header, data)
        }

        fun readBmsLine(line: String): Map<String, String>? {
            if (!line.startsWith("#")) {
                return null
            }
            val tokens = if (isLineDataType(line)) line.split(":") else line.split(" ")
            val key = tokens[0].uppercase()
            val value = tokens.drop(1).joinToString(" ")
            return hashMapOf(key to value)
        }

        private fun isLineDataType(line: String): Boolean {
            return line.length > 6 && line[6] == ':'
        }
    }

    init {
        bmsData.addAll(BmsHeader.preProcess(header))
        bmsData.addAll(BmsData.of(data))

        // set custom calculate bms Information
        bmsHeader.player = getPlayerInfo()
        bmsHeader.keys = getKeyInfo()

        bmsData.sort()
    }

    private fun getPlayerInfo(): String {
        val secondChannelData = bmsData.filter {
            val channel = it.getChannel()
            channel.isSecondPlayerType()
        }
        return if (secondChannelData.isEmpty()) "1" else "3"
    }

    private fun getKeyInfo(): Double {
        val maxKey = bmsData.mapNotNull {
            val channel = it.getChannel()
            if (channel.isPlayerType()) {
                val code = channel.value[1].code
                if (code == 6 || code == 7) {
                    null
                } else {
                    code
                }
            } else {
                null
            }
        }.sortedDescending()[0]
        return if (maxKey >= 8) (maxKey - 2).toDouble() else maxKey.toDouble()
    }

    override fun toString(): String {
        return Gson().toJson(this)
    }
}