package com.devjk.djtrinity.user.request

import com.devjk.djtrinity.framework.common.BaseRequest

data class UserRefreshRequest(
    var accessToken: String,
    var refreshToken: String
) : BaseRequest {
    override fun validate() {
    }
}