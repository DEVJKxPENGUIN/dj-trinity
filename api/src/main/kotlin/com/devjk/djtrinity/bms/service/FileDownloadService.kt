package com.devjk.djtrinity.bms.service

import org.springframework.core.io.Resource

interface FileDownloadService {
    fun loadFileAsResource(filePath: String): Resource
}