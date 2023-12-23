package com.devjk.djtrinity.framework.error

import org.springframework.http.HttpStatus

enum class ErrorCode(
        val httpStatus: HttpStatus,
        val value: Int,
        val message: String,
) {
    //format: off
    UNKNOWN_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, -1, "Unknown Error occurred"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, -2, "Internal Server Error"),
    ;
}