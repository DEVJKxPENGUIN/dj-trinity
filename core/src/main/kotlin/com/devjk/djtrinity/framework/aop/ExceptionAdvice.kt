package com.devjk.djtrinity.framework.aop

import com.devjk.djtrinity.common.BaseResponse
import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ExceptionAdvice {

    @ExceptionHandler(BaseException::class)
    fun handleBaseException(e: BaseException): ResponseEntity<*> {
        return handleResponse(e.errorCode, e)
    }

    @ExceptionHandler(Exception::class)
    fun handleException(e: Exception): ResponseEntity<*> {
        return handleResponse(ErrorCode.UNKNOWN, e)
    }

    private fun handleResponse(errorCode: ErrorCode, e: Exception): ResponseEntity<*> {
        return ResponseEntity.status(errorCode.httpStatus)
            .body(BaseResponse.error(errorCode, e.message ?: errorCode.message))
    }
}