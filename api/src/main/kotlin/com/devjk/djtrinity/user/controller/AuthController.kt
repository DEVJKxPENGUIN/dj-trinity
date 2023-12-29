package com.devjk.djtrinity.user.controller

import com.devjk.djtrinity.framework.common.BaseResponse
import com.devjk.djtrinity.framework.utils.CookieUtils
import com.devjk.djtrinity.user.request.UserLoginRequest
import com.devjk.djtrinity.user.request.UserSignupRequest
import com.devjk.djtrinity.user.service.UserService
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
class AuthController(
    private val userService: UserService
) {

    @PostMapping("/signup")
    fun signup(@RequestBody req: UserSignupRequest): ResponseEntity<*> {
        req.validate()
        userService.signup(req)
        return ResponseEntity.ok(BaseResponse.success())
    }

    @PostMapping("/login")
    fun login(@RequestBody req: UserLoginRequest, res: HttpServletResponse): ResponseEntity<*> {
        req.validate()
        val response = userService.login(req)
        CookieUtils.setRefreshCookie(response.refreshToken, res)
        return ResponseEntity.ok(BaseResponse.success(response))
    }

    @PostMapping("/refresh")
    fun refresh(
        @RequestHeader("Authorization") accessToken: String? = null,
        @CookieValue("trinity-rf") refreshToken: String? = null,
        res: HttpServletResponse
    ): ResponseEntity<*> {
        val response = userService.refresh(accessToken, refreshToken)
        CookieUtils.setRefreshCookie(response.refreshToken, res)
        return ResponseEntity.ok(BaseResponse.success(response))
    }

    @PostMapping("/logout")
    fun logout(
        @RequestHeader("Authorization") accessToken: String? = null,
        @CookieValue("trinity-rf") refreshToken: String? = null,
        res: HttpServletResponse
    ): ResponseEntity<*> {
        userService.logout(accessToken, refreshToken)
        CookieUtils.removeRefreshCookie(res)
        return ResponseEntity.ok(BaseResponse.success())
    }
}