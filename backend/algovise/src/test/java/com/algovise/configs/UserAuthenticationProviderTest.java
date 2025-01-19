package com.algovise.configs;

import com.algovise.dtos.UserDto;
import com.algovise.services.UserService;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserAuthenticationProviderTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserAuthenticationProvider userAuthenticationProvider;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(userAuthenticationProvider, "secretKey", "secret_key");
        userAuthenticationProvider.init();
    }

    @Test
    void testCreateToken() {
        String username = "testuser";

        String token = userAuthenticationProvider.createToken(username);

        assertNotNull(token, "Token should not be null");
    }

    @Test
    void testValidateToken() {
        String username = "testuser";
        UserDto userDto = new UserDto();
        userDto.setName(username);
        userDto.setId(123L);
        userDto.setRole("USER");

        when(userService.findByName(username)).thenReturn(userDto);

        String token = userAuthenticationProvider.createToken(username);

        UsernamePasswordAuthenticationToken authentication =
                (UsernamePasswordAuthenticationToken) userAuthenticationProvider.validateToken(token);

        assertNotNull(authentication);
        assertEquals(userDto, authentication.getPrincipal());
        assertEquals(Collections.emptyList(), authentication.getAuthorities());
        verify(userService, times(1)).findByName(username);
    }

    @Test
    void testValidateToken_invalidSignature() {
        String invalidToken = "some.invalid.token";

        assertThrows(JWTVerificationException.class,
                () -> userAuthenticationProvider.validateToken(invalidToken));
    }

    @Test
    void testIsUserAdmin_whenUserIsAdmin() {
        String adminUsername = "adminUser";
        UserDto adminDto = new UserDto();
        adminDto.setName(adminUsername);
        adminDto.setRole("ADMIN");

        when(userService.findByName(adminUsername)).thenReturn(adminDto);

        String token = userAuthenticationProvider.createToken(adminUsername);

        boolean isAdmin = userAuthenticationProvider.isUserAdmin(token);

        assertTrue(isAdmin, "Expected user to be admin");
        verify(userService, times(1)).findByName(adminUsername);
    }

    @Test
    void testIsUserAdmin_whenUserIsNotAdmin() {
        String username = "regularUser";
        UserDto userDto = new UserDto();
        userDto.setName(username);
        userDto.setRole("USER");

        when(userService.findByName(username)).thenReturn(userDto);

        String token = userAuthenticationProvider.createToken(username);

        boolean isAdmin = userAuthenticationProvider.isUserAdmin(token);

        assertFalse(isAdmin, "Expected user to not be admin");
        verify(userService, times(1)).findByName(username);
    }

    @Test
    void testGetUserIdByToken() {
        String username = "someUser";
        UserDto userDto = new UserDto();
        userDto.setName(username);
        userDto.setId(999L);
        userDto.setRole("USER");

        when(userService.findByName(username)).thenReturn(userDto);

        String token = userAuthenticationProvider.createToken(username);

        Long userId = userAuthenticationProvider.getUserIdByToken(token);

        assertEquals(999L, userId);
        verify(userService, times(1)).findByName(username);
    }
}
