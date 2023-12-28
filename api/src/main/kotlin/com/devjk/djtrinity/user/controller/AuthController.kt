package com.devjk.djtrinity.user.controller

import com.devjk.djtrinity.framework.common.BaseResponse
import com.devjk.djtrinity.user.request.UserLoginRequest
import com.devjk.djtrinity.user.request.UserSignupRequest
import com.devjk.djtrinity.user.service.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin
@RestController
@RequestMapping("/user")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping
    fun signup(@RequestBody req: UserSignupRequest): ResponseEntity<*> {
        req.validate()
        authService.signup(req)
        return ResponseEntity.ok().body(BaseResponse.success())
    }

    @PostMapping("/login")
    fun login(@RequestBody req: UserLoginRequest): ResponseEntity<*> {
        req.validate()
        val response = authService.login(req)
        return ResponseEntity.ok().body(BaseResponse.success(response))
    }
}