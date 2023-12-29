package com.devjk.djtrinity.framework.utils

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse

class CookieUtils {
    companion object {
        fun setRefreshCookie(refreshToken: String, res: HttpServletResponse) {
            val cookie = Cookie("trinity_rt", refreshToken).apply {
                path = "/"
                isHttpOnly = true
                maxAge = 3600 * 24 * 7
            }
            res.addCookie(cookie)
        }

        fun removeRefreshCookie(res: HttpServletResponse) {
            val cookie = Cookie("trinity_rt", null).apply {
                maxAge = 0
            }
            res.addCookie(cookie)
        }

    }
}