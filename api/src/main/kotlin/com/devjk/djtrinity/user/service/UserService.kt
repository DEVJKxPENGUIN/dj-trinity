package com.devjk.djtrinity.user.service

import com.devjk.djtrinity.db.entity.Token
import com.devjk.djtrinity.db.entity.User
import com.devjk.djtrinity.db.repository.TokenRepository
import com.devjk.djtrinity.db.repository.UserRepository
import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException
import com.devjk.djtrinity.framework.utils.JwtProvider
import com.devjk.djtrinity.user.request.UserLoginRequest
import com.devjk.djtrinity.user.request.UserSignupRequest
import com.devjk.djtrinity.user.response.LoginResponse
import com.devjk.djtrinity.user.response.UserResponse
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class UserService(
    private val userRepository: UserRepository,
    private val tokenRepository: TokenRepository,
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

    @Transactional
    fun login(req: UserLoginRequest): LoginResponse {
        val user = userRepository.findById(req.id)
            .orElseThrow { BaseException(ErrorCode.USER_NOT_FOUND, "id is not exists!") }

        if (!bCryptPasswordEncoder.matches(req.password, user.password)) {
            throw BaseException(ErrorCode.USER_INVALID_PASSWORD, "invalid password")
        }

        return issueLoginTokenSet(user)
    }

    @Transactional
    fun refresh(accessToken: String?, refreshToken: String?): LoginResponse {
        val token =
            tokenRepository.findByAccessTokenAndRefreshTokenAndRefreshTokenUsedAtIsNullAndRefreshTokenExpireAtAfter(
                accessToken,
                refreshToken,
                LocalDateTime.now()
            ) ?: throw BaseException(ErrorCode.AUTHENTICATION_REFRESH_FAILED)

        token.use()

        val user: User = userRepository.findByIdOrNull(token.userId) ?: throw BaseException(
            ErrorCode.USER_NOT_FOUND
        )
        return issueLoginTokenSet(user)
    }

    @Transactional
    fun logout(accessToken: String?, refreshToken: String?) {
        // refresh token 만 만료, access token 은 클라에서 자체파기 해야함.
        val token =
            tokenRepository.findByAccessTokenOrRefreshToken(accessToken, refreshToken)
        token?.use()
    }

    private fun issueLoginTokenSet(user: User): LoginResponse {
        val now = LocalDateTime.now()
        val accessToken = jwtProvider.createAccessToken(user.id, user.nickname, user.profile, now)
        val refreshToken = jwtProvider.createRefreshToken(user.id, now)

        val token = Token(
            userId = user.id,
            accessToken = accessToken,
            refreshToken = refreshToken,
            refreshTokenExpireAt = now.plusDays(1)
        )
        tokenRepository.save(token)

        return LoginResponse(accessToken, refreshToken)
    }

    @Transactional(readOnly = true)
    fun getUserInfo(id: String): UserResponse {
        val user = userRepository.findById(id)
            .orElseThrow { BaseException(ErrorCode.USER_NOT_FOUND) }
        return UserResponse(user.id, user.nickname, user.profile)
    }

    @Transactional(readOnly = true)
    fun getUserInfos(ids: String): List<UserResponse> {
        val userIds = ids.split(",")
        val users = userRepository.findAllById(userIds)
        return users.map { UserResponse(it.id, it.nickname, it.profile) }
    }
}