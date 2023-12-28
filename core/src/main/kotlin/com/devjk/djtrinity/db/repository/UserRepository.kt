package com.devjk.djtrinity.db.repository

import com.devjk.djtrinity.db.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, String> {

    fun findByIdAndPassword(id: String, password: String): Optional<User>
}