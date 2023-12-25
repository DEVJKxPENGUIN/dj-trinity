package com.devjk.djtrinity.framework.aop

import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException
import org.springframework.http.ResponseEntity
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ExceptionAdvice {

    @ExceptionHandler(BaseException::class)
    fun handleBaseException(e: BaseException): ResponseEntity<*> {
        return handleResponse(e.errorCode)
    }

    @ExceptionHandler(Exception::class)
    fun handleException(e: Exception): ResponseEntity<*> {
        return handleResponse(ErrorCode.UNKNOWN)
    }

    private fun handleResponse(errorCode: ErrorCode): ResponseEntity<*> {
        val map = LinkedMultiValueMap<String, String>()
        map.set("code", errorCode.value.toString())
        map.set("message", errorCode.message)
        return ResponseEntity.status(errorCode.httpStatus)
            .body(map)
    }
}