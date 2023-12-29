package com.devjk.djtrinity.bms.controller

import com.devjk.djtrinity.bms.service.FileDownloadService
import com.devjk.djtrinity.bms.service.FileService
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/download/bms")
class FileDownloadController(
    private val fileService: FileService,
    private val fileDownloadService: FileDownloadService
) {

    @GetMapping("/bmp01/{nodeId}")
    fun downloadBmp01(@PathVariable nodeId: Long): ResponseEntity<Resource> {
        val path = fileService.getBms01Path(nodeId)
        val resource = fileDownloadService.loadFileAsResource(path)
        return ResponseEntity.status(HttpStatus.OK).headers {
            it.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=${resource.filename}")
        }.body(resource)
    }

    @GetMapping("/sound/{nodeId}/{fileName}")
    fun downloadWav(@PathVariable nodeId: Long, @PathVariable fileName: String): ResponseEntity<Resource> {
        val path = fileService.getAvailableSoundPath(nodeId, fileName)
        val resource = fileDownloadService.loadFileAsResource(path)
        return ResponseEntity.status(HttpStatus.OK).headers {
            it.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=${resource.filename}")
        }.body(resource)
    }
}