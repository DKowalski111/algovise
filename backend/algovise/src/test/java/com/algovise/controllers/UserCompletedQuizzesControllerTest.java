package com.algovise.controllers;

import com.algovise.services.UserCompletedQuizzesService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserCompletedQuizzesControllerTest {

    @Mock
    private UserCompletedQuizzesService service;

    @InjectMocks
    private UserCompletedQuizzesController controller;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void shouldMarkQuizAsCompleted() throws Exception {
        Long userId = 1L;
        Long quizId = 101L;

        when(service.isQuizAlreadyCompleted(userId, quizId)).thenReturn(false);

        mockMvc.perform(post("/completed-quizzes")
                        .param("userId", String.valueOf(userId))
                        .param("quizId", String.valueOf(quizId))
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED))
                .andExpect(status().isOk())
                .andExpect(content().string("Quiz marked as completed."));

        verify(service).isQuizAlreadyCompleted(userId, quizId);
        verify(service).saveCompletedQuiz(userId, quizId);
    }

    @Test
    void shouldNotMarkQuizAsCompletedIfAlreadyCompleted() throws Exception {
        Long userId = 1L;
        Long quizId = 101L;

        when(service.isQuizAlreadyCompleted(userId, quizId)).thenReturn(true);

        mockMvc.perform(post("/completed-quizzes")
                        .param("userId", String.valueOf(userId))
                        .param("quizId", String.valueOf(quizId))
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED))
                .andExpect(status().isOk())
                .andExpect(content().string("Quiz marked as completed."));

        verify(service).isQuizAlreadyCompleted(userId, quizId);
        verify(service, never()).saveCompletedQuiz(anyLong(), anyLong());
    }

    @Test
    void shouldReturnTrueIfQuizIsCompleted() throws Exception {
        Long userId = 1L;
        Long quizId = 101L;

        when(service.isQuizAlreadyCompleted(userId, quizId)).thenReturn(true);

        mockMvc.perform(get("/completed-quizzes")
                        .param("userId", String.valueOf(userId))
                        .param("quizId", String.valueOf(quizId)))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(service).isQuizAlreadyCompleted(userId, quizId);
    }

    @Test
    void shouldReturnFalseIfQuizIsNotCompleted() throws Exception {
        Long userId = 1L;
        Long quizId = 101L;

        when(service.isQuizAlreadyCompleted(userId, quizId)).thenReturn(false);

        mockMvc.perform(get("/completed-quizzes")
                        .param("userId", String.valueOf(userId))
                        .param("quizId", String.valueOf(quizId)))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));

        verify(service).isQuizAlreadyCompleted(userId, quizId);
    }
}
