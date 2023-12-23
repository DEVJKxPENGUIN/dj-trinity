package com.devjk.djtrinity.framework.entity

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@MappedSuperclass
@EntityListeners(AuditingEntityListener::class)
abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    var id: Long? = null

//    @CreatedDate
//    @Column(name = "created_at")
//    val createdAt: LocalDateTime? = null
//
//    @LastModifiedDate
//    @Column(name = "modified_at")
//    val modifiedAt: LocalDateTime? = null
}