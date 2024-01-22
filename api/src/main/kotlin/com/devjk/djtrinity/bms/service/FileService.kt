package com.devjk.djtrinity.bms.service

import com.devjk.djtrinity.bms.response.BmsHeaderResponse
import com.devjk.djtrinity.bms.response.BmsResponse
import com.devjk.djtrinity.db.entity.BmsNode
import com.devjk.djtrinity.db.repository.BmsNodeRepository
import com.devjk.djtrinity.domain.Bms
import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException
import org.apache.commons.lang3.StringUtils
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.io.BufferedReader
import java.io.File
import java.io.FileReader
import java.nio.file.Files
import java.nio.file.Paths

@Service
class FileService(
    private val bmsService: BmsService,
    private val bmsNodeRepository: BmsNodeRepository
) {
    private val log = LoggerFactory.getLogger(this.javaClass)

    fun getBmsListAll(): Map<String, List<BmsHeaderResponse>> {
        return bmsNodeRepository.findAll()
            .groupBy { it.rootPath }
            .mapKeys { it.key.substringAfterLast("/") }
            .mapValues { bmsList ->
                bmsList.value.mapNotNull { bmsNode ->
                    try {
                        val bms = readBms(bmsNode)
                        BmsHeaderResponse(bmsNode.id!!, bmsService.parseHeaderInfo(bms))
                    } catch (e: Exception) {
                        e.printStackTrace()
                        null
                    }
                }
            }
    }

    fun readBms(bmsNode: BmsNode): String {
        val file = File(bmsNode.fullPath())
        if (!file.exists() || file.isDirectory()) {
            throw BaseException(
                ErrorCode.BMS_FILE_NOT_FOUND,
                "BMS file 경로 탐색 실패 : ${file.absolutePath}"
            )
        }
        return read(file)
    }

    private fun read(file: File): String {
        val sb = StringBuilder()
        BufferedReader(FileReader(file)).use { reader ->
            var line: String?
            while ((reader.readLine().also { line = it }) != null) {
                sb.append(line).append("\n")
            }
        }
        return sb.toString()
    }

    fun findAllBmsInDirectory(): List<BmsNode> {
        log.info(System.getProperty("user.dir"))
        val root = File("../bms")
        val bmsNodes = mutableListOf<BmsNode>()
        treeTraversal(root, bmsNodes)
        return bmsNodes
    }

    private fun treeTraversal(file: File, bmsNodes: MutableList<BmsNode>) {
        if (file.isDirectory()) {
            val subFiles = file.listFiles()
            assert(subFiles != null)
            for (subFile in subFiles!!) {
                treeTraversal(subFile, bmsNodes)
            }
            return
        }

        val fileName = file.name
        for (bmsExtension in Bms.BMS_EXTENSIONS) {
            if (!fileName.endsWith(".${bmsExtension}")) {
                continue
            }

            val bmsNode = BmsNode.of(fileName, file.canonicalFile.parent)
            bmsNodes.add(bmsNode)
        }
    }

    fun syncWithDb() {
        val bmsNodes = bmsNodeRepository.findAll()
        findAllBmsInDirectory().mapNotNullTo(bmsNodes) { bmsNode ->
            if (bmsNodes.contains(bmsNode)) {
                null
            } else {
                bmsNode
            }
        }
        bmsNodeRepository.saveAll(bmsNodes)
    }

    fun getBms01Path(nodeId: Long): String {
        val bmsNode = findBmsByNodeId(nodeId)
        val bms = read(File(bmsNode.fullPath()))
        val bmsHeader = bmsService.parseHeaderInfo(bms)

        if (StringUtils.isBlank(bmsHeader.bmp01)) {
            return "../resource/sample.jpeg"
        }

        return "${bmsNode.rootPath}/${bmsHeader.bmp01}"
    }

    fun parseBms(nodeId: Long): BmsResponse {
        val bmsNode = findBmsByNodeId(nodeId)
        val bmsStr = readBms(bmsNode)
        val bms = bmsService.parse(bmsStr)
        return BmsResponse(bms)
    }

    fun getAvailableSoundPath(nodeId: Long, fileName: String): String {
        val bmsNode = findBmsByNodeId(nodeId)
        var soundPath = Paths.get(bmsNode.rootPath, fileName)
        if (Files.exists(soundPath)) {
            return soundPath.toString()
        }

        for (extension in Bms.SOUND_EXTENSIONS) {
            val extDotIndex = fileName.lastIndexOf(".")
            val anotherName = "${fileName.substring(0, extDotIndex)}.${extension}"
            soundPath = Paths.get(bmsNode.rootPath, anotherName)
            if (Files.exists(soundPath)) {
                return soundPath.toString()
            }
        }

        throw BaseException(
            ErrorCode.BMS_SOUND_NOT_FOUND,
            "해당 fileName 의 사운드파일을 찾을 수 없습니다. : $fileName"
        )
    }

    private fun findBmsByNodeId(nodeId: Long): BmsNode {
        return bmsNodeRepository
            .findById(nodeId)
            .orElseThrow {
                BaseException(
                    ErrorCode.BMS_FILE_NOT_FOUND,
                    "nodeId 에 해당하는 bms 를 찾을 수 없습니다. : $nodeId"
                )
            }
    }
}