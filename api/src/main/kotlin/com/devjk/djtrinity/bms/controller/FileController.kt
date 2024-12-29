package com.devjk.djtrinity.bms.controller

import com.devjk.djtrinity.bms.response.FFMpegConvertResult
import com.devjk.djtrinity.bms.service.FileService
import com.devjk.djtrinity.bms.service.VideoService
import com.devjk.djtrinity.framework.common.BaseResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/bms")
class FileController(
    private val fileService: FileService,
    private val videoService: VideoService
) {

    @PostMapping("/sync")
    fun sync(): ResponseEntity<BaseResponse<*>> {
        fileService.syncWithDb()
        val response: FFMpegConvertResult = videoService.convertAllForHtml()
        return ResponseEntity.ok(BaseResponse.success(response))
    }

    @GetMapping("/list")
    fun listAll(): ResponseEntity<*> {
        val response = fileService.getBmsListAll()
        return ResponseEntity.ok(BaseResponse.success(response))
    }

    @GetMapping("/{nodeId}")
    fun parseBms(@PathVariable nodeId: Long): ResponseEntity<*> {
        val response = fileService.parseBms(nodeId)
        return ResponseEntity.ok(BaseResponse.success(response))
    }
}