package com.devjk.djtrinity.domain

import com.devjk.djtrinity.framework.utils.TrinityUtils
import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.google.gson.Gson
import java.io.BufferedReader
import java.io.StringReader

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
class BmsData private constructor(
    private val bar: Int,
    private val bmsChannel: BmsChannel,
    private val position: Double?,
    private val value: Double
) : Comparable<BmsData> {

    companion object {
        fun of(data: String): List<BmsData> {
            val bmsData = ArrayList<BmsData>()
            BufferedReader(StringReader(data)).use { reader ->
                var line: String?
                while ((reader.readLine().also { line = it }) != null) {
                    Bms.readBmsLine(line!!)?.let {
                        bmsData.addAll(of(it.keys.first(), it.values.first()))
                    }
                }
            }
            return bmsData
        }

        fun of(parseKey: String, parseValue: String): List<BmsData> {
            var parseValue = parseValue
            val bar = parseKey.substring(1, 4).toInt()
            val bmsChannel = BmsChannel.from(parseKey.substring(4))

            if (BmsChannel.BAR_SHORTEN == bmsChannel) {
                return listOf(BmsData(bar, bmsChannel, null, parseValue.toDouble()))
            }

            if (parseValue.length % 2 != 0) {
                parseValue = parseValue.substring(0, parseValue.length - 1)
            }

            val total: Int = parseValue.length / 2
            return (0 until total)
                .mapNotNull { i ->
                    val value = if (BmsChannel.BPM === bmsChannel) { // bpm 채널은 16진수
                        TrinityUtils.base16ToDecimal(parseValue.substring(i * 2, (i + 1) * 2))
                    } else {
                        TrinityUtils.base36ToDecimal(parseValue.substring(i * 2, (i + 1) * 2))
                    }

                    if (value == 0) null
                    else BmsData(bar, bmsChannel, i / total.toDouble(), value.toDouble())
                }
                .toList()
        }
    }

    fun getChannel(): BmsChannel {
        return bmsChannel
    }

    override fun compareTo(other: BmsData): Int {
        val barCompare = bar.compareTo(other.bar)
        if (barCompare != 0) {
            return barCompare
        }
        if (position != null && other.position != null) {
            return position.compareTo(other.position)
        } else if (position != null) {
            return 1
        } else if (other.position != null) {
            return -1
        }
        return 0
    }

    override fun toString(): String {
        return Gson().toJson(this)
    }
}