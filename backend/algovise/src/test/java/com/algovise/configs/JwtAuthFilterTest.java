package com.algovise.configs;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

import static org.mockito.Mockito.*;

class JwtAuthFilterTest {

    @Mock
    private UserAuthenticationProvider userAuthenticationProvider;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    private JwtAuthFilter jwtAuthFilter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtAuthFilter = new JwtAuthFilter(userAuthenticationProvider);
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldAuthenticateWhenValidTokenIsProvided() throws ServletException, IOException {
        String validToken = "valid.jwt.token";
        Authentication authentication = mock(Authentication.class);

        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer " + validToken);
        when(userAuthenticationProvider.validateToken(validToken)).thenReturn(authentication);

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verify(userAuthenticationProvider).validateToken(validToken);
        verify(filterChain).doFilter(request, response);
        assert SecurityContextHolder.getContext().getAuthentication() == authentication;
    }

    @Test
    void shouldNotAuthenticateWhenNoAuthorizationHeaderIsPresent() throws ServletException, IOException {
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verifyNoInteractions(userAuthenticationProvider);
        verify(filterChain).doFilter(request, response);
        assert SecurityContextHolder.getContext().getAuthentication() == null;
    }

    @Test
    void shouldNotAuthenticateWhenInvalidTokenIsProvided() throws ServletException, IOException {
        String invalidToken = "invalid.jwt.token";

        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer " + invalidToken);
        doThrow(new RuntimeException("Invalid token")).when(userAuthenticationProvider).validateToken(invalidToken);

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verify(userAuthenticationProvider).validateToken(invalidToken);
        verify(filterChain).doFilter(request, response);
        assert SecurityContextHolder.getContext().getAuthentication() == null;
    }


    @Test
    void shouldNotAuthenticateWhenAuthorizationHeaderFormatIsInvalid() throws ServletException, IOException {
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("InvalidHeaderFormat");

        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        verifyNoInteractions(userAuthenticationProvider);
        verify(filterChain).doFilter(request, response);
        assert SecurityContextHolder.getContext().getAuthentication() == null;
    }
}
