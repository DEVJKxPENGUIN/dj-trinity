package com.devjk.djtrinity.db.entity

import com.devjk.djtrinity.framework.common.BaseEntity
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "token")
@EntityListeners
class Token(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "user_id")
    val userId: String,

    @Column(name = "access_token")
    val accessToken: String,

    @Column(name = "refresh_token")
    val refreshToken: String,

    @Column(name = "refresh_token_used_at")
    var refreshTokenUsedAt: LocalDateTime? = null,

    @Column(name = "refresh_token_expire_at")
    val refreshTokenExpireAt: LocalDateTime,
) : BaseEntity() {

    fun use() {
        refreshTokenUsedAt = LocalDateTime.now()
    }
}