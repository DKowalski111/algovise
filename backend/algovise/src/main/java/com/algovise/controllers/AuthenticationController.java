package com.algovise.controllers;

import com.algovise.configs.UserAuthenticationProvider;
import com.algovise.dtos.CredentialsDto;
import com.algovise.dtos.SignUpDto;
import com.algovise.dtos.UserDto;
import com.algovise.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {
    private final UserService userService;
    private final UserAuthenticationProvider userAuthenticationProvider;

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody @Valid CredentialsDto credentialsDto)
    {
        UserDto userDto = userService.login(credentialsDto);
        userDto.setToken(userAuthenticationProvider.createToken(credentialsDto.getName()));
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody @Valid SignUpDto signUpDto)
    {
        UserDto userDto = userService.register(signUpDto);
        userDto.setToken(userAuthenticationProvider.createToken(signUpDto.getName()));
        return ResponseEntity.created(URI.create("/users/" + userDto.getId())).body(userDto);
    }

    @PostMapping("/checkToken")
    public ResponseEntity<?> checkToken(@RequestBody String token) {
        try {
            boolean isTokenValid = userAuthenticationProvider.validateToken(token).isAuthenticated();

            if (isTokenValid) {
                return ResponseEntity.ok(true);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token format");
        }
    }

    @PostMapping("/admin")
    public ResponseEntity<Boolean> isUserAdmin(@RequestBody String token)
    {
        return ResponseEntity.ok().body(userAuthenticationProvider.isUserAdmin(token));
    }

}
