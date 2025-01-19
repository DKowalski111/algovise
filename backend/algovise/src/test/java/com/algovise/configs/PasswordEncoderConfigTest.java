package com.algovise.configs;

import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class PasswordEncoderConfigTest {

    @Test
    void shouldCreatePasswordEncoderBean() {
        try (var context = new AnnotationConfigApplicationContext(PasswordEncoderConfig.class)) {
            PasswordEncoder passwordEncoder = context.getBean(PasswordEncoder.class);
            assertNotNull(passwordEncoder, "PasswordEncoder bean should be initialized");
        }
    }
}
