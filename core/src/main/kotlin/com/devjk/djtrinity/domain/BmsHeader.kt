package com.devjk.djtrinity.domain

import com.devjk.djtrinity.framework.utils.TrinityUtils
import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.google.gson.Gson
import java.io.BufferedReader
import java.io.StringReader
import java.util.concurrent.ThreadLocalRandom

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
class BmsHeader private constructor(
    // bms header
    var player: String? = null,
    var genre: String? = null,
    var title: String? = null,
    var artist: String? = null,
    var startBpm: Double? = null,
    var playLevel: Double? = null,
    var rank: Double? = null,
    var total: Double? = null,
    var stageFile: String? = null,
    var bmp01: String? = null,
    var wav: Array<String?>? = null,
    var bpm: Array<Double?>? = null,
    var stop: Array<Double?>? = null,
    var difficulty: Double? = null,
    var random: Double? = null,

    // custom values
    var keys: Double? = null,

    header: String,
    parseWav: Boolean
) {


    companion object {
        fun fromInfo(bms: String): BmsHeader {
            return BmsHeader(header = bms, parseWav = false)
        }

        fun fromAll(bms: String): BmsHeader {
            return BmsHeader(header = bms, parseWav = true)
        }

        fun preProcess(header: String): List<BmsData> {
            var isRead = false
            val bmsData: ArrayList<BmsData> = ArrayList()
            var random = -1

            // set random
            BufferedReader(StringReader(header)).use { reader ->
                var line: String?
                while ((reader.readLine().also { line = it }) != null) {
                    Bms.readBmsLine(line!!)?.let {
                        if (it.keys.first() == "#RANDOM") {
                            random = ThreadLocalRandom.current()
                                .nextInt(1, it.values.first().toInt() + 1)
                        }
                    }
                }
            }

            BufferedReader(StringReader(header)).use { reader ->
                var line: String?
                while ((reader.readLine().also { line = it }) != null) {
                    Bms.readBmsLine(line!!)?.let {
                        isRead = processRandomAndIfState(
                            it.keys.first(),
                            it.values.first(),
                            isRead,
                            bmsData,
                            random
                        )
                    }
                }
            }

            return bmsData
        }

        private fun processRandomAndIfState(
            key: String,
            value: String,
            isRead: Boolean,
            bmsData: ArrayList<BmsData>,
            random: Int
        ): Boolean {
            when (key) {
                "#IF" -> {
                    return value.toInt() == random
                }

                "#ELSE" -> {
                    return !isRead
                }

                "#ENDIF" -> {
                    return false
                }
            }

            if (!isRead) {
                return false
            }

            bmsData.addAll(BmsData.of(key, value))
            return true
        }
    }

    init {
        if (parseWav) {
            wav = arrayOfNulls(36 * 36)
            bpm = arrayOfNulls(36 * 36)
            stop = arrayOfNulls(36 * 36)
        }
        process(header, parseWav)
    }

    private fun process(header: String, parseWav: Boolean) {
        BufferedReader(StringReader(header)).use { reader ->
            var line: String?
            while ((reader.readLine().also { line = it }) != null) {
                Bms.readBmsLine(line!!)
                    ?.let { setByKey(it.keys.first(), it.values.first(), parseWav) }
            }
        }
    }

    private fun setByKey(key: String, value: String, parseWav: Boolean) {
        when (key) {
            "#PLAYER" -> player = value
            "#GENRE" -> genre = value
            "#TITLE" -> title = value
            "#ARTIST" -> artist = value
            "#BPM" -> startBpm = value.toDouble()
            "#PLAYLEVEL" -> playLevel = value.toDouble()
            "#RANK" -> rank = value.toDouble()
            "#TOTAL" -> total = value.toDouble()
            "#STAGEFILE" -> stageFile = value
            "#BMP01" -> bmp01 = value
            "#DIFFICULTY" -> difficulty = value.toDouble()
            else -> {
                if (!parseWav) {
                    return
                }
                if (key.startsWith("#WAV", ignoreCase = true)) {
                    val keyNo = TrinityUtils.base36ToDecimal(key.substring(4))
                    wav?.set(keyNo, value)
                    return
                }
                if (key.startsWith("#BPM", ignoreCase = true)) {
                    val keyNo = TrinityUtils.base36ToDecimal(key.substring(4))
                    bpm?.set(keyNo, value.toDouble())
                    return
                }
                if (key.startsWith("#STOP", ignoreCase = true)) {
                    val keyNo = TrinityUtils.base36ToDecimal(key.substring(5))
                    stop?.set(keyNo, value.toDouble())
                    return
                }
            }
        }
    }

    override fun toString(): String {
        return Gson().toJson(this)
    }
}