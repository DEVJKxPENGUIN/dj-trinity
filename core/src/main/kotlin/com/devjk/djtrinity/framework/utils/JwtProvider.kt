package com.devjk.djtrinity.framework.utils

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.sql.Timestamp
import java.time.LocalDateTime

@Service
class JwtProvider(
    @Value("\${jwt-secret-key}")
    private val secretKey: String,
    @Value("\${jwt-expiration-minutes}")
    private val expirationMinutes: Long
) {

    fun createToken(id: String, nickname: String, profile: String?): String {
        val claims = Jwts.claims()
            .add("nickname", nickname)
            .add("profile", profile)
            .build()

        return Jwts.builder()
            .subject(id)
            .claims(claims)
            .issuer("trinity")
            .issuedAt(Timestamp.valueOf(LocalDateTime.now()))
            .expiration(Timestamp.valueOf(LocalDateTime.now().plusMinutes(expirationMinutes)))
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
}