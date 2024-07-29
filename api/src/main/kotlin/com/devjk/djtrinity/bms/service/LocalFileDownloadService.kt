package com.devjk.djtrinity.bms.service

import com.devjk.djtrinity.framework.error.ErrorCode
import com.devjk.djtrinity.framework.error.exception.BaseException
import org.springframework.context.annotation.Profile
import org.springframework.core.io.Resource
import org.springframework.core.io.ResourceLoader
import org.springframework.stereotype.Service

@Service
@Profile("local")
class LocalFileDownloadService(
    private val resourceLoader: ResourceLoader
) : FileDownloadService {
    override fun loadFileAsResource(filePath: String): Resource {
        return resourceLoader.getResource("file:$filePath")
    }
}