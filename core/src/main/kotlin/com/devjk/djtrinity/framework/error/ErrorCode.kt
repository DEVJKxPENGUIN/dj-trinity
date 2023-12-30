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
    INVALID_SIGNUP_REQ(HttpStatus.BAD_REQUEST, -7, "Invalid Signup Request"),
    INVALID_SIGNUP_ID_DUPLICATED(HttpStatus.BAD_REQUEST, -8, "Invalid duplicated id request"),
    USER_NOT_FOUND(HttpStatus.BAD_REQUEST, -9, "User is not found"),
    USER_INVALID_PASSWORD(HttpStatus.BAD_REQUEST, -10, "Password mismatched"),
    AUTHENTICATION_EXPIRED(HttpStatus.BAD_REQUEST, -11, "cannot find valid token"),
    CHANNEL_FULL(HttpStatus.SERVICE_UNAVAILABLE, -12, "Channel is full"),
    ;
}