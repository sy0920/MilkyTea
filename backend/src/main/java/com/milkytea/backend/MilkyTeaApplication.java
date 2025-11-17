package com.milkytea.backend;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition(info = @Info(title = "MilkyTea API", version = "v1", description = "Auth and User Profile APIs"))
@SpringBootApplication
public class MilkyTeaApplication {
    public static void main(String[] args) {
        SpringApplication.run(MilkyTeaApplication.class, args);
    }
}

