package com.algovise.services;

import com.algovise.entities.UserCompletedQuizzes;
import com.algovise.repositories.UserCompletedQuizzesRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserCompletedQuizzesServiceTest {

    @Mock
    private UserCompletedQuizzesRepository repository;

    @InjectMocks
    private UserCompletedQuizzesService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldReturnTrueIfQuizIsAlreadyCompleted() {
        when(repository.existsByUserIdAndQuizId(1L, 101L)).thenReturn(true);

        boolean result = service.isQuizAlreadyCompleted(1L, 101L);

        assertTrue(result);
        verify(repository).existsByUserIdAndQuizId(1L, 101L);
    }

    @Test
    void shouldReturnFalseIfQuizIsNotCompleted() {
        when(repository.existsByUserIdAndQuizId(1L, 101L)).thenReturn(false);

        boolean result = service.isQuizAlreadyCompleted(1L, 101L);

        assertFalse(result);
        verify(repository).existsByUserIdAndQuizId(1L, 101L);
    }

    @Test
    void shouldSaveCompletedQuizIfNotAlreadyCompleted() {
        when(repository.existsByUserIdAndQuizId(1L, 101L)).thenReturn(false);

        service.saveCompletedQuiz(1L, 101L);

        verify(repository).existsByUserIdAndQuizId(1L, 101L);
        verify(repository).save(argThat(quiz -> quiz.getUserId().equals(1L) && quiz.getQuizId().equals(101L)));
    }

    @Test
    void shouldNotSaveCompletedQuizIfAlreadyCompleted() {
        when(repository.existsByUserIdAndQuizId(1L, 101L)).thenReturn(true);

        service.saveCompletedQuiz(1L, 101L);

        verify(repository).existsByUserIdAndQuizId(1L, 101L);
        verify(repository, never()).save(any(UserCompletedQuizzes.class));
    }

    @Test
    void shouldDeleteQuizFromAllUsers() {
        List<UserCompletedQuizzes> quizzes = new ArrayList<>();
        UserCompletedQuizzes quiz1 = new UserCompletedQuizzes();
        quiz1.setUserId(1L);
        quiz1.setQuizId(101L);
        quizzes.add(quiz1);

        UserCompletedQuizzes quiz2 = new UserCompletedQuizzes();
        quiz2.setUserId(2L);
        quiz2.setQuizId(101L);
        quizzes.add(quiz2);

        when(repository.findAll()).thenReturn(quizzes);

        service.deleteQuiz(101L);

        verify(repository, times(1)).delete(quiz1);
        verify(repository, times(1)).delete(quiz2);
    }
}
