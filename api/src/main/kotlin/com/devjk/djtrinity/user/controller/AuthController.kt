package com.devjk.djtrinity.user.controller

import com.devjk.djtrinity.framework.common.BaseResponse
import com.devjk.djtrinity.user.request.UserLoginRequest
import com.devjk.djtrinity.user.request.UserSignupRequest
import com.devjk.djtrinity.user.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin
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
    fun login(@RequestBody req: UserLoginRequest): ResponseEntity<*> {
        req.validate()
        val response = userService.login(req)
        return ResponseEntity.ok(BaseResponse.success(response))
    }
}