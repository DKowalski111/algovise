package com.algovise.controllers;

import com.algovise.configs.UserAuthenticationProvider;
import com.algovise.dtos.CredentialsDto;
import com.algovise.dtos.SignUpDto;
import com.algovise.dtos.UserDto;
import com.algovise.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthenticationControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserAuthenticationProvider userAuthenticationProvider;

    @InjectMocks
    private AuthenticationController authenticationController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authenticationController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void shouldLoginSuccessfully() throws Exception {
        CredentialsDto credentials = CredentialsDto.builder()
                .name("TestUser")
                .password("password".toCharArray())
                .build();

        UserDto userDto = new UserDto();
        userDto.setId(1L);
        userDto.setName("TestUser");

        when(userService.login(credentials)).thenReturn(userDto);
        when(userAuthenticationProvider.createToken("TestUser")).thenReturn("dummy-token");

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("TestUser"))
                .andExpect(jsonPath("$.token").value("dummy-token"));

        verify(userService).login(credentials);
        verify(userAuthenticationProvider).createToken("TestUser");
    }

    @Test
    void shouldRegisterSuccessfully() throws Exception {
        SignUpDto signUpDto = SignUpDto.builder()
                .name("NewUser")
                .email("newuser@example.com")
                .password("password".toCharArray())
                .build();

        UserDto userDto = new UserDto();
        userDto.setId(1L);
        userDto.setName("NewUser");

        when(userService.register(signUpDto)).thenReturn(userDto);
        when(userAuthenticationProvider.createToken("NewUser")).thenReturn("dummy-token");

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpDto)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/users/1"))
                .andExpect(jsonPath("$.name").value("NewUser"))
                .andExpect(jsonPath("$.token").value("dummy-token"));

        verify(userService).register(signUpDto);
        verify(userAuthenticationProvider).createToken("NewUser");
    }

    @Test
    void shouldCheckTokenSuccessfully() throws Exception {
        String token = "dummy-token";

        Authentication mockAuthentication = mock(Authentication.class);
        when(mockAuthentication.isAuthenticated()).thenReturn(true);

        when(userAuthenticationProvider.validateToken(token)).thenReturn(mockAuthentication);

        mockMvc.perform(post("/checkToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(token))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(userAuthenticationProvider).validateToken(token);
        verify(mockAuthentication).isAuthenticated();
    }

    @Test
    void shouldReturnUnauthorizedForInvalidToken() throws Exception {
        String token = "invalid-token";

        Authentication mockAuthentication = mock(Authentication.class);
        when(mockAuthentication.isAuthenticated()).thenReturn(false);

        when(userAuthenticationProvider.validateToken(token)).thenReturn(mockAuthentication);

        mockMvc.perform(post("/checkToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(token))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid token"));

        verify(userAuthenticationProvider).validateToken(token);
        verify(mockAuthentication).isAuthenticated();
    }


    @Test
    void shouldReturnBadRequestForMalformedToken() throws Exception {
        String malformedToken = "malformed-token";

        when(userAuthenticationProvider.validateToken(malformedToken)).thenThrow(new RuntimeException("Invalid token format"));

        mockMvc.perform(post("/checkToken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(malformedToken))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid token format"));

        verify(userAuthenticationProvider).validateToken(malformedToken);
    }

    @Test
    void shouldReturnIfUserIsAdmin() throws Exception {
        String token = "admin-token";

        when(userAuthenticationProvider.isUserAdmin(token)).thenReturn(true);

        mockMvc.perform(post("/admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(token))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(userAuthenticationProvider).isUserAdmin(token);
    }
}
