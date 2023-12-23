package com.devjk.djtrinity.framework.config

import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@Configuration
@EnableJpaRepositories(basePackages = ["com.devjk.djtrinity.domain.repository"])
class JpaConfig {
}