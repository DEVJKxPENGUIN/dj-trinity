package com.devjk.djtrinity.bms.service

import com.devjk.djtrinity.bms.response.FFMpegConvertResult
import com.devjk.djtrinity.db.entity.BmsNode
import com.devjk.djtrinity.domain.Bms.Companion.BMP_UNSUPPORTED_EXTENSIONS
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

@Service
class VideoService(
    private val fileService: FileService
) {

    private val log = LoggerFactory.getLogger(this.javaClass)

    fun convertAllForHtml(): FFMpegConvertResult {
        val bmsNodes: List<BmsNode> = fileService.findAllBmsInDirectory().distinctBy { it.rootPath }
        var targetCount = 0
        var cachedCount = 0
        var convertedCount = 0
        var failedCount = 0

        for (bmsNode in bmsNodes) {
            // rootPath 하위의 파일 형식 중 mpg, wmv, mpeg 가 있으면 ffmpeg 로 변환
            // 변환된 파일은 rootPath 하위에 생성
            // 변환된 파일은 mp4 확장자로 생성
            val file = File(bmsNode.rootPath)
            file.listFiles { _, fileName ->

                if (fileName.endsWith(".mp4") || fileName.endsWith(".mpeg") || fileName.endsWith(".wav") || fileName.endsWith(
                        ".mpg"
                    )
                ) {
                    log.debug("this is target file: $fileName")
                    //
                }

                BMP_UNSUPPORTED_EXTENSIONS.any { fileName.endsWith(".$it") }
            }?.forEach { bmsFile ->
                val inputPath = bmsFile.absolutePath
                val outputPath = "${bmsFile.absolutePath.split(".")[0]}.mp4"

                targetCount++

                // 이미 변환된 파일이 있으면 skip
//                if (File(outputPath).exists()) {
//                    cachedCount++
//                    return@forEach
//                }

                val result = convertToMp4(inputPath, outputPath)
                if (result) {
                    convertedCount++
                } else {
                    failedCount++
                }
            }

        }

        return FFMpegConvertResult(targetCount, cachedCount, convertedCount, failedCount)
    }

    fun convertToMp4(inputPath: String, outputPath: String): Boolean {
        val command = listOf(
            "ffmpeg",
            "-i", inputPath,
            "-y",
            "-an",
            "-c:v", "h264_videotoolbox",
            "-crf", "18",
            "-preset", "veryslow",
            outputPath
        )

        return try {
            val process = ProcessBuilder(command)
                .redirectErrorStream(true) // FFmpeg 오류 메시지도 읽을 수 있도록 설정
                .start()

            // FFmpeg의 출력 읽기
            BufferedReader(InputStreamReader(process.inputStream)).lines().forEach { println(it) }

            // 명령 실행 대기
            process.waitFor()

            // 성공 여부 반환
            process.exitValue() == 0
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

}