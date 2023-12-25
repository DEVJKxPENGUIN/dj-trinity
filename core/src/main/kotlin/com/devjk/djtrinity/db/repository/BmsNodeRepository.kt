package com.devjk.djtrinity.db.repository

import com.devjk.djtrinity.db.entity.BmsNode
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BmsNodeRepository: JpaRepository<BmsNode, Long> {

}