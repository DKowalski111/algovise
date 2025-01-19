package com.algovise.controllers;

import com.algovise.configs.UserAuthenticationProvider;
import com.algovise.dtos.QuizDto;
import com.algovise.services.QuizService;
import com.algovise.services.UserCompletedQuizzesService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class QuizControllerTest {

    @Mock
    private QuizService quizService;

    @Mock
    private UserCompletedQuizzesService userCompletedQuizzesService;

    @Mock
    private UserAuthenticationProvider userAuthenticationProvider;

    @InjectMocks
    private QuizController quizController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(quizController).build();

        ReflectionTestUtils.setField(quizController, "uploadDir", "/tmp/quizzes");
    }

    @Test
    void shouldGetAllQuizzes() throws Exception {
        QuizDto quiz1 = new QuizDto(1L, "Quiz 1");
        QuizDto quiz2 = new QuizDto(2L, "Quiz 2");

        when(quizService.getAllQuizzes()).thenReturn(List.of(quiz1, quiz2));

        mockMvc.perform(get("/quizzes/list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].title").value("Quiz 1"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].title").value("Quiz 2"));

        verify(quizService).getAllQuizzes();
    }

    @Test
    void shouldAddQuizSuccessfully() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "quiz.json", "application/json", "{}".getBytes());
        String token = "admin-token";

        when(userAuthenticationProvider.isUserAdmin(token)).thenReturn(true);

        mockMvc.perform(multipart("/quizzes/add")
                        .file(file)
                        .param("title", "New Quiz")
                        .param("token", token))
                .andExpect(status().isOk())
                .andExpect(content().string("Quiz saved successfully."));

        verify(userAuthenticationProvider).isUserAdmin(token);
        verify(quizService).saveQuiz(eq("New Quiz"), anyString());
    }

    @Test
    void shouldNotAddQuizIfNotAdmin() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "quiz.json", "application/json", "{}".getBytes());
        String token = "user-token";

        when(userAuthenticationProvider.isUserAdmin(token)).thenReturn(false);

        mockMvc.perform(multipart("/quizzes/add")
                        .file(file)
                        .param("title", "New Quiz")
                        .param("token", token))
                .andExpect(status().isForbidden())
                .andExpect(content().string("User not permitted to add new quiz."));

        verify(userAuthenticationProvider).isUserAdmin(token);
        verify(quizService, never()).saveQuiz(anyString(), anyString());
    }

    @Test
    void shouldGetQuizFileContent() throws Exception {
        when(quizService.getQuizContent(1L)).thenReturn("{ \"quiz\": \"content\" }");

        mockMvc.perform(get("/quizzes/file/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("{ \"quiz\": \"content\" }"));

        verify(quizService).getQuizContent(1L);
    }

    @Test
    void shouldDeleteQuizSuccessfully() throws Exception {
        String token = "admin-token";
        String filePath = "/path/to/quiz.json";

        when(userAuthenticationProvider.isUserAdmin(token)).thenReturn(true);

        when(quizService.getQuizFilePath(1L)).thenReturn(filePath);

        try (var mockedFiles = mockStatic(Files.class)) {
            mockedFiles.when(() -> Files.exists(Path.of(filePath))).thenReturn(true);
            mockedFiles.when(() -> Files.delete(Path.of(filePath))).thenAnswer(invocation -> null);

            mockMvc.perform(delete("/quizzes/delete/1")
                            .param("token", token))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Quiz deleted successfully."));

            verify(userAuthenticationProvider).isUserAdmin(token);
            verify(quizService).getQuizFilePath(1L);
            verify(quizService).deleteQuiz(1L);
            verify(userCompletedQuizzesService).deleteQuiz(1L);

            mockedFiles.verify(() -> Files.exists(Path.of(filePath)));
            mockedFiles.verify(() -> Files.delete(Path.of(filePath)));
        }
    }

    @Test
    void shouldNotDeleteQuizIfNotAdmin() throws Exception {
        String token = "user-token";

        when(userAuthenticationProvider.isUserAdmin(token)).thenReturn(false);

        mockMvc.perform(delete("/quizzes/delete/1")
                        .param("token", token))
                .andExpect(status().isForbidden())
                .andExpect(content().string("User not permitted to delete quizzes."));

        verify(userAuthenticationProvider).isUserAdmin(token);
        verify(quizService, never()).getQuizFilePath(anyLong());
        verify(quizService, never()).deleteQuiz(anyLong());
        verify(userCompletedQuizzesService, never()).deleteQuiz(anyLong());
    }
}
