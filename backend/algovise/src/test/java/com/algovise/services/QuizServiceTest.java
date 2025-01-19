package com.algovise.services;

import com.algovise.dtos.QuizDto;
import com.algovise.entities.Quiz;
import com.algovise.repositories.QuizRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    @InjectMocks
    private QuizService quizService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldGetAllQuizzes() {
        Quiz quiz1 = new Quiz();
        quiz1.setId(1L);
        quiz1.setTitle("Quiz 1");

        Quiz quiz2 = new Quiz();
        quiz2.setId(2L);
        quiz2.setTitle("Quiz 2");

        when(quizRepository.findAll()).thenReturn(List.of(quiz1, quiz2));

        List<QuizDto> quizzes = quizService.getAllQuizzes();

        assertEquals(2, quizzes.size());
        assertEquals("Quiz 1", quizzes.get(0).getTitle());
        assertEquals("Quiz 2", quizzes.get(1).getTitle());
        verify(quizRepository).findAll();
    }

    @Test
    void shouldGetQuizContent() throws IOException {
        Quiz quiz = new Quiz();
        quiz.setId(1L);
        quiz.setFilePath("/path/to/quiz.txt");

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        Path mockPath = Path.of(quiz.getFilePath());
        String mockContent = "This is the content of the quiz.";
        mockStatic(Files.class);
        when(Files.readString(mockPath)).thenReturn(mockContent);

        String content = quizService.getQuizContent(1L);

        assertEquals(mockContent, content);
        verify(quizRepository).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenQuizNotFoundForContent() {
        when(quizRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> quizService.getQuizContent(1L));

        assertEquals("Quiz not found", exception.getMessage());
        verify(quizRepository).findById(1L);
    }

    @Test
    void shouldSaveQuiz() {
        quizService.saveQuiz("New Quiz", "/path/to/new_quiz.txt");

        verify(quizRepository).save(argThat(quiz ->
                quiz.getTitle().equals("New Quiz") && quiz.getFilePath().equals("/path/to/new_quiz.txt")));
    }

    @Test
    void shouldGetQuizFilePath() {
        Quiz quiz = new Quiz();
        quiz.setId(1L);
        quiz.setFilePath("/path/to/quiz.txt");

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));

        String filePath = quizService.getQuizFilePath(1L);

        assertEquals("/path/to/quiz.txt", filePath);
        verify(quizRepository).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenQuizNotFoundForFilePath() {
        when(quizRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> quizService.getQuizFilePath(1L));

        assertEquals("Quiz not found with ID: 1", exception.getMessage());
        verify(quizRepository).findById(1L);
    }

    @Test
    void shouldDeleteQuiz() {
        quizService.deleteQuiz(1L);

        verify(quizRepository).deleteById(1L);
    }
}
