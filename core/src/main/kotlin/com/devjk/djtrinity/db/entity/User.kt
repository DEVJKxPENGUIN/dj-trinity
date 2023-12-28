package com.devjk.djtrinity.db.entity

import com.devjk.djtrinity.framework.common.BaseEntity
import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.persistence.*

@Entity
@Table(name = "user")
@EntityListeners
class User(
    @Id
    @Column(name = "id")
    val id: String,

    @JsonIgnore
    @Column(name = "password")
    var password: String? = null,

    @Column(name = "nickname")
    var nickname: String,

    @Column(name = "profile")
    var profile: String? = null
) : BaseEntity() {

    init {
        if (!Regex("^[a-zA-Z0-9]{3,20}$").matches(id)) {
            throw BaseException(
                ErrorCode.INVALID_SIGNUP_REQ,
                "Id should be 3 - 20(length), only a-Z, 0-9"
            )
        }
        if (password?.length !in 8..20) {
            throw BaseException(ErrorCode.INVALID_SIGNUP_REQ, "Password should be 8 - 20(length)")
        }
    }

    override fun toString(): String {
        return ObjectMapper().writeValueAsString(this)
    }
}