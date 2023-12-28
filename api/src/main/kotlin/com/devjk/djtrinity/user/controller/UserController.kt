package com.devjk.djtrinity.user.controller

import com.devjk.djtrinity.common.BaseResponse
import com.devjk.djtrinity.user.request.UserRequest
import com.devjk.djtrinity.user.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin
@RestController
@RequestMapping("/user")
class UserController(
    private val userService: UserService
) {

    @PostMapping
    fun signup(@RequestBody req: UserRequest): ResponseEntity<BaseResponse<Unit>> {
        req.validate()
        userService.signup(req)
        return ResponseEntity.ok().body(BaseResponse.success())
    }
}