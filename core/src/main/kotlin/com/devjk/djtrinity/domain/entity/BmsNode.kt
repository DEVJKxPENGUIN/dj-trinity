package com.devjk.djtrinity.domain.entity

import com.devjk.djtrinity.framework.entity.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.Table

@Entity
@Table(name = "bms_node")
@EntityListeners
class BmsNode : BaseEntity() {

    @Column(name = "file_name")
    lateinit var fileName: String

    @Column(name = "root_path")
    lateinit var rootPath: String
}