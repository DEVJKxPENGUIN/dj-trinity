package com.devjk.djtrinity.bms.service

import com.devjk.djtrinity.domain.Bms
import com.devjk.djtrinity.domain.Bms.Companion.HEADER_FIELD
import com.devjk.djtrinity.domain.Bms.Companion.MAIN_DATA_FIELD
import com.devjk.djtrinity.domain.BmsHeader
import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class BmsService {
    private val log = LoggerFactory.getLogger(this.javaClass)

    fun parseHeaderInfo(bms: String): BmsHeader {
        try {
            return BmsHeader.fromInfo(getHeaderSection(bms))
        } catch (e: Exception) {
            e.printStackTrace()
            log.warn("unable to parse : ${bms.substring(0, 50)}")
            throw BaseException(ErrorCode.BMS_PARSE_FAILED, "bms header section parse failed")
        }
    }

    fun parse(bms: String): Bms {
        try {
            val headerSection = getHeaderSection(bms)
            val dataSection = getDataSection(bms)
            return Bms.parse(headerSection, dataSection)
        } catch (e: Exception) {
            e.printStackTrace()
            log.warn("unable to parse : ${bms.substring(0, 50)}")
            throw BaseException(ErrorCode.BMS_PARSE_FAILED)
        }
    }

    fun getHeaderSection(bms: String): String {
        return bms.split(MAIN_DATA_FIELD)[0].split(HEADER_FIELD)[1]
    }

    fun getDataSection(bms: String): String {
        return bms.split(MAIN_DATA_FIELD)[1]
    }
}