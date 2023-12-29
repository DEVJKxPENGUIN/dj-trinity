package com.devjk.djtrinity.framework.utils

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.sql.Timestamp
import java.time.LocalDateTime
import java.util.*

@Service
class JwtProvider(
    @Value("\${jwt-secret-key}")
    private val secretKey: String,
    @Value("\${jwt-expiration-minutes}")
    private val expirationMinutes: Long
) {

    fun createAccessToken(
        id: String,
        nickname: String,
        profile: String?,
        now: LocalDateTime
    ): String {
        val claims = Jwts.claims()
            .add("nickname", nickname)
            .add("profile", profile)
            .build()

        return Jwts.builder()
            .subject(id)
            .claims(claims)
            .issuer("trinity")
            .issuedAt(Timestamp.valueOf(now))
            .expiration(Timestamp.valueOf(now.plusMinutes(expirationMinutes)))
            .signWith(Keys.hmacShaKeyFor(secretKey.toByteArray()))
            .compact()
    }

    fun createRefreshToken(id: String, now: LocalDateTime): String {
        return Jwts.builder()
            .subject(id)
            .issuer("trinity-refresh")
            .issuedAt(Timestamp.valueOf(now))
            .expiration(Timestamp.valueOf(now.plusDays(1)))
            .signWith(Keys.hmacShaKeyFor(secretKey.toByteArray()))
            .compact()
    }

    fun getUserIdFromToken(token: String): String {
        val key = Keys.hmacShaKeyFor(secretKey.toByteArray())
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
            .subject
    }

    fun getExpireAtFromToken(token:String): Date {
        val key = Keys.hmacShaKeyFor(secretKey.toByteArray())
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
            .expiration
    }
}