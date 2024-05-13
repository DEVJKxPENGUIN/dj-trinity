package com.devjk.djtrinity

import jakarta.annotation.PostConstruct
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching
import org.springframework.data.jpa.repository.config.EnableJpaAuditing
import java.util.*

@EnableCaching
@EnableJpaAuditing
@SpringBootApplication
class DjTrinityApiApplication

fun main(args: Array<String>) {
    runApplication<DjTrinityApiApplication>(*args)
}

@PostConstruct
fun timezone() {
    TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
}