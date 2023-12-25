package com.devjk.djtrinity.framework.error

import org.springframework.http.HttpStatus

enum class ErrorCode(
    val httpStatus: HttpStatus,
    val value: Int,
    val message: String,
) {
    //format: off
    UNKNOWN(HttpStatus.INTERNAL_SERVER_ERROR, -1, "Unknown Error occurred"),
    INTERNAL_SERVER(HttpStatus.INTERNAL_SERVER_ERROR, -2, "Internal Server Error"),
    BMS_PARSE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, -3, "BMS Parsing Error occurred"),
    BMS_FILE_NOT_FOUND(HttpStatus.NOT_FOUND, -4, "BMS File Not Found"),
    BMS_SOUND_NOT_FOUND(HttpStatus.NOT_FOUND, -5, "BMS Sound File Not Found : "),
    BMS_READ_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, -6, "BMS Read Error"),
    ;
}