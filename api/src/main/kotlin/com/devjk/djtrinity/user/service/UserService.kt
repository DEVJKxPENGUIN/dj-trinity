package com.devjk.djtrinity.user.service

import com.devjk.djtrinity.db.entity.User
import com.devjk.djtrinity.db.repository.UserRepository
import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException
import com.devjk.djtrinity.framework.utils.JwtProvider
import com.devjk.djtrinity.user.request.UserLoginRequest
import com.devjk.djtrinity.user.request.UserSignupRequest
import com.devjk.djtrinity.user.response.LoginResponse
import com.devjk.djtrinity.user.response.UserResponse
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder,
    private val jwtProvider: JwtProvider
) {
    fun signup(req: UserSignupRequest) {
        // check duplicated id
        if (userRepository.existsById(req.id)) {
            throw BaseException(
                ErrorCode.INVALID_SIGNUP_ID_DUPLICATED,
                "[${req.id}] ID already exists!"
            )
        }

        val user = User(req.id, req.password, "NEWBIE_${req.id}")
        user.password = bCryptPasswordEncoder.encode(req.password)
        userRepository.save(user)
    }

    @Transactional(readOnly = true)
    fun login(req: UserLoginRequest): LoginResponse {
        val user = userRepository.findById(req.id)
            .orElseThrow { BaseException(ErrorCode.USER_NOT_FOUND, "id is not exists!") }

        if (!bCryptPasswordEncoder.matches(req.password, user.password)) {
            throw BaseException(ErrorCode.USER_INVALID_PASSWORD, "invalid password")
        }

        val token = jwtProvider.createToken(user.id, user.nickname, user.profile)
        return LoginResponse(token)
    }

    @Transactional(readOnly = true)
    fun getUserInfo(id: String): UserResponse {
        val user = userRepository.findById(id)
            .orElseThrow { BaseException(ErrorCode.USER_NOT_FOUND, "id is not exists!") }
        return UserResponse(user.id, user.nickname, user.profile)
    }
}