package com.devjk.djtrinity.db.repository

import com.devjk.djtrinity.db.entity.Token
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface TokenRepository : JpaRepository<Token, Long> {
    fun findByAccessTokenAndRefreshTokenAndRefreshTokenUsedAtIsNullAndRefreshTokenExpireAtAfter(
        accessToken: String?,
        refreshToken: String?,
        expireAt: LocalDateTime
    ): Token?

    fun findByAccessTokenOrRefreshToken(
        accessToken: String?,
        refreshToken: String?
    ): Token?
}