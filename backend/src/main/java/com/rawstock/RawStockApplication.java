package com.rawstock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RawStockApplication {

    public static void main(String[] args) {

        SpringApplication.run(RawStockApplication.class, args);

        System.out.println("=================================");
        System.out.println("      RAWSTOCK SERVER STARTED");
        System.out.println("      http://localhost:8080");
        System.out.println("=================================");
    }
}