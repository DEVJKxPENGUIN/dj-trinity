package com.devjk.djtrinity.user.controller

import com.devjk.djtrinity.framework.common.BaseResponse
import com.devjk.djtrinity.user.service.UserService
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController(
    private val userService: UserService
) {
    private val log = LoggerFactory.getLogger(this.javaClass)

    @GetMapping("/user")
    fun getAuthenticatedUserInfo(@AuthenticationPrincipal userId: String): ResponseEntity<*> {
        val response = userService.getUserInfo(userId)
        return ResponseEntity.ok(BaseResponse.success(response))
    }

    @GetMapping("/users")
    fun getUsersInfo(@RequestParam(required = true) userIds: String): ResponseEntity<*> {
        val response = userService.getUserInfos(userIds)
        return ResponseEntity.ok(BaseResponse.success(response))
    }

    @GetMapping("/user/{userId}")
    fun getUserInfo(@PathVariable userId: String): ResponseEntity<*> {
        val response = userService.getUserInfo(userId)
        return ResponseEntity.ok(BaseResponse.success(response))
    }
}