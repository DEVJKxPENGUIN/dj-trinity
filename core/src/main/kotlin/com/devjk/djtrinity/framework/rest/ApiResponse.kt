package com.devjk.djtrinity.framework.rest

import com.devjk.djtrinity.framework.error.ErrorCode
import com.fasterxml.jackson.annotation.JsonInclude
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

@JsonInclude(JsonInclude.Include.NON_NULL)
class ApiResponse<T>(
    status: HttpStatus,
    private var code: Int = 0,
    private var message: String? = "",
    private var data: T? = null
) : ResponseEntity<T>(status) {

    companion object {
        fun success(): ApiResponse<Unit> {
            return ApiResponse(HttpStatus.OK)
        }

        fun <T> success(data: T): ApiResponse<T> {
            return ApiResponse(HttpStatus.OK, 0, "OK", data)
        }

        fun <T> error(errorCode: ErrorCode, message: String?): ApiResponse<T> {
            return ApiResponse(errorCode.httpStatus, errorCode.value, message)
        }
    }
}