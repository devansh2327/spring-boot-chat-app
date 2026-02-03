package com.example.chat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ❌ CSRF breaks WebSocket STOMP
                .csrf(csrf -> csrf.disable())

                // ❌ Disable default login & basic auth
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                // ✅ Allow everything (for dev/demo)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/ws/**",
                                "/app/**",
                                "/topic/**",
                                "/css/**",
                                "/js/**"
                        ).permitAll()
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}
