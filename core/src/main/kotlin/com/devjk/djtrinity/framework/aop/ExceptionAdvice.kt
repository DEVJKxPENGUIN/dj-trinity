package com.devjk.djtrinity.framework.aop

import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException
import com.devjk.djtrinity.framework.rest.ApiResponse
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ExceptionAdvice {

    @ExceptionHandler(BaseException::class)
    fun handleBaseException(e: BaseException): ApiResponse<*> {
        return handleResponse(e.errorCode)
    }

    @ExceptionHandler(Exception::class)
    fun handleException(e: Exception): ApiResponse<*> {
        return handleResponse(ErrorCode.UNKNOWN)
    }

    private fun handleResponse(errorCode: ErrorCode): ApiResponse<Unit> {
        return ApiResponse.error(errorCode, errorCode.message)
    }
}