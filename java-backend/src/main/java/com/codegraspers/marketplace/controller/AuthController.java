package com.codegraspers.marketplace.controller;

import com.codegraspers.marketplace.model.Role;
import com.codegraspers.marketplace.model.User;
import com.codegraspers.marketplace.repository.UserRepository;
import com.codegraspers.marketplace.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public record RegisterRequest(String fullName, String email, String password, Role role) {}
    public record LoginRequest(String email, String password) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        Role assignedRole = (req.role() != null) ? req.role() : Role.BUYER;

        User user = User.builder()
                .fullName(req.fullName())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .role(assignedRole)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(
                Map.of("role", user.getRole().name(), "fullName", user.getFullName()),
                user
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "token", token,
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", user.getRole().name()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );

        User user = userRepository.findByEmail(req.email()).orElseThrow();
        String token = jwtService.generateToken(
                Map.of("role", user.getRole().name(), "fullName", user.getFullName()),
                user
        );

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", user.getRole().name()
        ));
    }
}