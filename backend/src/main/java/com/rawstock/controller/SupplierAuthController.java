
package com.rawstock.controller;

import com.rawstock.model.Supplier;
import com.rawstock.repository.SupplierRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.core.userdetails.User;import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/supplier-auth")
// @CrossOrigin(origins = "*")
public class SupplierAuthController {

    private final SupplierRepository supplierRepository;
    private final PasswordEncoder passwordEncoder;

    public SupplierAuthController(
            SupplierRepository supplierRepository,
            PasswordEncoder passwordEncoder) {

        this.supplierRepository = supplierRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> credentials,
            HttpServletRequest request,
            HttpServletResponse response) {

        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || username.isBlank()
                || password == null || password.isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Username and password are required."
                    ));
        }

        Optional<Supplier> result =
                supplierRepository.findByUsername(username.trim());

        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid username or password."
                    ));
        }

        Supplier supplier = result.get();

        if (supplier.getPassword() == null
                || !passwordEncoder.matches(
                        password, supplier.getPassword())) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid username or password."
                    ));
        }

        // Rotate the session ID after successful login.
        // Create a session, then rotate its ID after login.
request.getSession(true);
request.changeSessionId();

        User principal = new User(
                supplier.getUsername(),
                supplier.getPassword(),
                List.of(
                        new SimpleGrantedAuthority("ROLE_SUPPLIER")
                )
        );

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        principal.getAuthorities()
                );

        SecurityContext context =
                SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        SecurityContextRepository contextRepository =
                new HttpSessionSecurityContextRepository();

        contextRepository.saveContext(
                context, request, response
        );

        return ResponseEntity.ok(Map.of(
                "message", "Login successful.",
                "supplierId", supplier.getSupplierId(),
                "username", supplier.getUsername(),
                "supplierName", supplier.getSupplierName()
        ));
    }
}
