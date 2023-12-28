package com.devjk.djtrinity.user.service

import com.devjk.djtrinity.db.entity.User
import com.devjk.djtrinity.db.repository.UserRepository
import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException
import com.devjk.djtrinity.user.request.UserRequest
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository
) {
    fun signup(req: UserRequest) {
        // check duplicated id
        if (userRepository.existsById(req.id)) {
            throw BaseException(
                ErrorCode.INVALID_SIGNUP_ID_DUPLICATED,
                "[${req.id}] ID already exists!"
            )
        }

        val user = User(req.id, req.password, "NEWBIE_${req.id}")
        userRepository.save(user)
    }
}