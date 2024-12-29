package com.devjk.djtrinity.db.entity

import com.devjk.djtrinity.framework.common.BaseEntity
import jakarta.persistence.*

@Entity
@Table(name = "bms_node")
@EntityListeners
class BmsNode(
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "file_name")
    val fileName: String,

    @Column(name = "root_path")
    val rootPath: String
) : BaseEntity() {

    companion object {
        fun of(fileName: String, rootPath: String): BmsNode {
            return BmsNode(null, fileName, rootPath)
        }
    }

    fun fullPath(): String {
        return "${rootPath}/${fileName}"
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as BmsNode

        if (fileName != other.fileName) return false
        if (rootPath != other.rootPath) return false

        return true
    }

    override fun hashCode(): Int {
        var result = fileName.hashCode()
        result = 31 * result + rootPath.hashCode()
        return result
    }

    override fun toString(): String {
        return "BmsNode(id=$id, fileName='$fileName', rootPath='$rootPath')"
    }


}