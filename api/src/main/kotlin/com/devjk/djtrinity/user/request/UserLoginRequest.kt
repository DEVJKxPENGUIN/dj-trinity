package com.devjk.djtrinity.user.request

import com.devjk.djtrinity.framework.common.BaseRequest
import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException

data class UserLoginRequest(
    var id: String,
    var password: String
) : BaseRequest {
    override fun validate() {
        if (!Regex("^[a-zA-Z0-9]{3,20}$").matches(id)) {
            throw BaseException(
                ErrorCode.INVALID_SIGNUP_REQ,
                "Id should be 3 - 20(length), only a-Z, 0-9"
            )
        }
        if (password.length !in 8..20) {
            throw BaseException(ErrorCode.INVALID_SIGNUP_REQ, "Password should be 8 - 20(length)")
        }
    }
}