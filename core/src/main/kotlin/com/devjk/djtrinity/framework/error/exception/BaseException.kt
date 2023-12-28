package com.devjk.djtrinity.framework.error.exception

import com.devjk.djtrinity.framework.error.ErrorCode

class BaseException(
    val errorCode: ErrorCode,
    val detailMessage: String? = null
) : RuntimeException(detailMessage ?: errorCode.message) {
}