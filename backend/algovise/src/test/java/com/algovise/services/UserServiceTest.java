package com.algovise.services;

import com.algovise.dtos.CredentialsDto;
import com.algovise.dtos.SignUpDto;
import com.algovise.dtos.UserDto;
import com.algovise.entities.User;
import com.algovise.exceptions.AppException;
import com.algovise.mappings.UserMapper;
import com.algovise.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.CharBuffer;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldLoginSuccessfully() {
        char[] password = "password".toCharArray();
        CredentialsDto credentials = CredentialsDto.builder()
                .name("TestUser")
                .password(password)
                .build();

        User user = new User();
        user.setName("TestUser");
        user.setPassword("encodedPassword");

        UserDto userDto = new UserDto();

        when(userRepository.findByName("TestUser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(CharBuffer.wrap(password), "encodedPassword")).thenReturn(true);
        when(userMapper.toUserDto(user)).thenReturn(userDto);

        UserDto result = userService.login(credentials);

        assertNotNull(result);
        verify(userRepository).findByName("TestUser");
        verify(passwordEncoder).matches(CharBuffer.wrap(password), "encodedPassword");

        assertArrayEquals(new char[password.length], password, "Password array should be cleared");
    }

    @Test
    void shouldThrowExceptionForInvalidLogin() {
        char[] password = "password".toCharArray();
        CredentialsDto credentials = CredentialsDto.builder()
                .name("InvalidUser")
                .password(password)
                .build();

        when(userRepository.findByName("InvalidUser")).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> userService.login(credentials));

        assertEquals("User not found", exception.getMessage());
        verify(userRepository).findByName("InvalidUser");
        verify(passwordEncoder, never()).matches(any(), any());

        assertArrayEquals(new char[password.length], password, "Password array should be cleared");
    }


    @Test
    void shouldThrowExceptionWhenRegisteringExistingUser() {
        char[] password = "password".toCharArray();
        SignUpDto signUpDto = SignUpDto.builder()
                .name("ExistingUser")
                .email("email@example.com")
                .password(password)
                .build();

        User existingUser = new User();

        when(userRepository.findByName("ExistingUser")).thenReturn(Optional.of(existingUser));

        AppException exception = assertThrows(AppException.class, () -> userService.register(signUpDto));

        assertEquals("User already exists", exception.getMessage());
        verify(userRepository).findByName("ExistingUser");

        assertArrayEquals(new char[password.length], password, "Password array should be cleared");
    }



    @Test
    void shouldGetUserById() {
        User user = new User();
        user.setId(1L);
        UserDto userDto = new UserDto();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toUserDto(user)).thenReturn(userDto);

        UserDto result = userService.getUserById(1L);

        assertNotNull(result);
        verify(userRepository).findById(1L);
    }

    @Test
    void shouldThrowExceptionIfUserNotFoundById() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> userService.getUserById(1L));

        assertEquals("User not found with id: 1", exception.getMessage());
        verify(userRepository).findById(1L);
    }

    @Test
    void shouldUpdateUser() {
        User user = new User();
        user.setId(1L);
        user.setName("OldName");
        user.setEmail("old@example.com");

        UserDto userDto = new UserDto();
        userDto.setName("NewName");
        userDto.setEmail("new@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toUserDto(user)).thenReturn(userDto);
        when(userRepository.save(user)).thenReturn(user);

        UserDto result = userService.updateUser(1L, userDto);

        assertEquals("NewName", result.getName());
        assertEquals("new@example.com", result.getEmail());
        verify(userRepository).save(user);
    }

    @Test
    void shouldDeleteUser() {
        User user = new User();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        userService.deleteUser(1L);

        verify(userRepository).delete(user);
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonexistentUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> userService.deleteUser(1L));

        assertEquals("User not found with id: 1", exception.getMessage());
        verify(userRepository, never()).delete(any());
    }
}
