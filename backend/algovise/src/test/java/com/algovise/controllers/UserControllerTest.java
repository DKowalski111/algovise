package com.algovise.controllers;

import com.algovise.configs.UserAuthenticationProvider;
import com.algovise.dtos.UpdateUserDto;
import com.algovise.dtos.UserDto;
import com.algovise.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserAuthenticationProvider userAuthenticationProvider;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void shouldGetUserById() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setId(1L);
        userDto.setName("Test User");

        when(userService.getUserById(1L)).thenReturn(userDto);

        mockMvc.perform(get("/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Test User"));

        verify(userService).getUserById(1L);
    }

    @Test
    void shouldGetAllUsers() throws Exception {
        UserDto user1 = new UserDto();
        user1.setId(1L);
        user1.setName("User 1");

        UserDto user2 = new UserDto();
        user2.setId(2L);
        user2.setName("User 2");

        when(userService.getAllUsers()).thenReturn(List.of(user1, user2));

        mockMvc.perform(get("/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("User 1"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].name").value("User 2"));

        verify(userService).getAllUsers();
    }

    @Test
    void shouldUpdateUser() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setId(1L);
        userDto.setName("Updated User");

        when(userService.updateUser(eq(1L), any(UserDto.class))).thenReturn(userDto);

        mockMvc.perform(put("/user/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Updated User"));

        verify(userService).updateUser(eq(1L), any(UserDto.class));
    }

    @Test
    void shouldDeleteUser() throws Exception {
        doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/user/1"))
                .andExpect(status().isNoContent());

        verify(userService).deleteUser(1L);
    }

    @Test
    void shouldUpdateName() throws Exception {
        UpdateUserDto updateUserDto = new UpdateUserDto(1L, "New Name", null, null);

        UserDto userDto = new UserDto();
        userDto.setId(1L);
        userDto.setName("New Name");
        userDto.setToken("dummy-token");

        when(userService.updateName(eq(1L), eq("New Name"))).thenReturn(userDto);
        when(userAuthenticationProvider.createToken("New Name")).thenReturn("dummy-token");

        mockMvc.perform(post("/user/update-name")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateUserDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("New Name"))
                .andExpect(jsonPath("$.token").value("dummy-token"));

        verify(userService).updateName(eq(1L), eq("New Name"));
        verify(userAuthenticationProvider).createToken("New Name");
    }

    @Test
    void shouldUpdateEmail() throws Exception {
        UpdateUserDto updateUserDto = new UpdateUserDto(1L, null, "newemail@example.com", null);

        UserDto userDto = new UserDto();
        userDto.setId(1L);
        userDto.setEmail("newemail@example.com");

        when(userService.updateEmail(eq(1L), eq("newemail@example.com"))).thenReturn(userDto);

        mockMvc.perform(post("/user/update-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateUserDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.email").value("newemail@example.com"));

        verify(userService).updateEmail(eq(1L), eq("newemail@example.com"));
    }

    @Test
    void shouldUpdatePassword() throws Exception {
        UpdateUserDto updateUserDto = new UpdateUserDto(1L, null, null, "newpassword".toCharArray());

        UserDto userDto = new UserDto();
        userDto.setId(1L);

        when(userService.updatePassword(eq(1L), any(char[].class))).thenReturn(userDto);

        mockMvc.perform(post("/user/update-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateUserDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));

        verify(userService).updatePassword(eq(1L), any(char[].class));
    }
}
