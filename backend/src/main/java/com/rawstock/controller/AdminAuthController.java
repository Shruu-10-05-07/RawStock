package com.rawstock.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin-auth")
// @CrossOrigin(origins = "*")
public class AdminAuthController {

    @Value("${RAWSTOCK_ADMIN_USERNAME:admin}")
    private String adminUsername;

    @Value("${RAWSTOCK_ADMIN_PASSWORD:ChangeMe123!}")
    private String adminPassword;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> credentials,
            HttpServletRequest request,
            HttpServletResponse response) {

        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null
                || username.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message",
                            "Username and password are required."));
        }

        if (!adminUsername.equals(username.trim())
                || !adminPassword.equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("message",
                            "Invalid username or password."));
        }

        // Create a session, then rotate its ID.
        request.getSession(true);
        request.changeSessionId();

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        username.trim(),
                        null,
                        List.of(
                                new SimpleGrantedAuthority("ROLE_ADMIN")
                        )
                );

        SecurityContext context =
                SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        SecurityContextRepository contextRepository =
                new HttpSessionSecurityContextRepository();

        contextRepository.saveContext(
                context, request, response);

        return ResponseEntity.ok(Map.of(
                "message", "Login successful.",
                "username", username.trim(),
                "role", "ADMIN"
        ));
        
    }


    // CHECK WHETHER ADMIN IS LOGGED IN
    @GetMapping("/me")
    public ResponseEntity<?> checkSession(
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || !authentication.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority()
                                .equals("ROLE_ADMIN"))) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Admin login required."));
        }

        return ResponseEntity.ok(Map.of(
                "username", authentication.getName(),
                "role", "ADMIN"
        ));
    }

    // ADMIN LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request) {

        SecurityContextHolder.clearContext();

        var session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully."));
    }}

