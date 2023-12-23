package com.devjk.djtrinity

import jakarta.annotation.PostConstruct
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import java.util.*


@SpringBootApplication
class DjTrinityGameApplication

fun main(args: Array<String>) {
    runApplication<DjTrinityGameApplication>(*args)
}

@PostConstruct
fun timezone() {
    TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
}