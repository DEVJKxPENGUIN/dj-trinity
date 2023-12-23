package com.devjk.djtrinity.framework.rest

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ApiResponse(
        val code: Int,
        val message: String,
        val data: Any? = null,
) {
    companion object {
        fun success(data: Any? = null) = ApiResponse(
                code = 0,
                message = "OK",
                data = data,
        )

        fun error(code: Int, message: String) = ApiResponse(
                code = code,
                message = message,
        )
    }
}