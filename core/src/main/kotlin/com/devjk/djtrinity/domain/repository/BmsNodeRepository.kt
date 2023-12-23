package com.devjk.djtrinity.domain.repository

import com.devjk.djtrinity.domain.entity.BmsNode
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BmsNodeRepository: JpaRepository<BmsNode, Long> {
}