package com.devjk.djtrinity.framework.error.exception

import com.devjk.djtrinity.framework.error.ErrorCode

class BaseException(
        val errorCode: ErrorCode, override val message: String?
) : RuntimeException() {
    constructor(errorCode: ErrorCode) : this(errorCode, errorCode.message)
}