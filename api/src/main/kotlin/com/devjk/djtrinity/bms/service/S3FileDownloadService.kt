package com.devjk.djtrinity.bms.service

import org.springframework.context.annotation.Profile
import org.springframework.core.io.Resource
import org.springframework.stereotype.Service

@Service
@Profile("dev", "real")
class S3FileDownloadService : FileDownloadService {
    override fun loadFileAsResource(filePath: String): Resource {
        TODO("Not yet implemented")
    }
}