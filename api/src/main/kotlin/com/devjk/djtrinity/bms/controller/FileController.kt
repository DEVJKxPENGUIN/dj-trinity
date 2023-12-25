package com.devjk.djtrinity.bms.controller

import com.devjk.djtrinity.bms.response.BmsHeaderResponse
import com.devjk.djtrinity.bms.response.BmsResponse
import com.devjk.djtrinity.bms.service.FileService
import com.devjk.djtrinity.framework.rest.ApiResponse
import org.springframework.web.bind.annotation.*

@CrossOrigin
@RestController
@RequestMapping("/bms")
class FileController(
    private val fileService: FileService
) {

    @PostMapping("/sync")
    fun sync(): ApiResponse<*> {
        fileService.syncWithDb()
        return ApiResponse.success()
    }

    @GetMapping("/list")
    fun listAll(): ApiResponse<List<BmsHeaderResponse>> {
        val response = fileService.getBmsListAll()
        return ApiResponse.success(response)
    }

    @GetMapping("/{nodeId}")
    fun parseBms(@PathVariable nodeId: Long): ApiResponse<BmsResponse> {
        val response = fileService.parseBms(nodeId)
        return ApiResponse.success(response)
    }
}