package com.algovise.controllers;

import com.algovise.configs.UserAuthenticationProvider;
import com.algovise.dtos.TutorialDto;
import com.algovise.services.TutorialService;
import com.fasterxml.jackson.databind.ObjectMapper;
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

class TutorialControllerTest {

    @Mock
    private TutorialService tutorialService;

    @Mock
    private UserAuthenticationProvider userAuthenticationProvider;

    @InjectMocks
    private TutorialController tutorialController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(tutorialController).build();

        ReflectionTestUtils.setField(tutorialController, "uploadDir", "/tmp/tutorials");
    }

    @Test
    void shouldGetAllTutorials() throws Exception {
        TutorialDto tutorial1 = new TutorialDto(1L, "Tutorial 1");
        TutorialDto tutorial2 = new TutorialDto(2L, "Tutorial 2");

        when(tutorialService.getAllTutorials()).thenReturn(List.of(tutorial1, tutorial2));

        mockMvc.perform(get("/tutorials/list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].title").value("Tutorial 1"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].title").value("Tutorial 2"));

        verify(tutorialService).getAllTutorials();
    }

    @Test
    void shouldAddTutorialSuccessfully() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "tutorial.md", "text/markdown", "# Markdown Content".getBytes());
        String token = "admin-token";

        when(userAuthenticationProvider.isUserAdmin(token)).thenReturn(true);

        mockMvc.perform(multipart("/tutorials/add")
                        .file(file)
                        .param("title", "New Tutorial")
                        .param("token", token))
                .andExpect(status().isOk())
                .andExpect(content().string("Tutorial saved successfully."));

        verify(userAuthenticationProvider).isUserAdmin(token);
        verify(tutorialService).saveTutorial(eq("New Tutorial"), anyString());
    }

    @Test
    void shouldNotAddTutorialIfNotAdmin() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "tutorial.md", "text/markdown", "# Markdown Content".getBytes());
        String token = "user-token";

        when(userAuthenticationProvider.isUserAdmin(token)).thenReturn(false);

        mockMvc.perform(multipart("/tutorials/add")
                        .file(file)
                        .param("title", "New Tutorial")
                        .param("token", token))
                .andExpect(status().isForbidden())
                .andExpect(content().string("User not permitted to add new tutorial."));

        verify(userAuthenticationProvider).isUserAdmin(token);
        verify(tutorialService, never()).saveTutorial(anyString(), anyString());
    }

    @Test
    void shouldGetTutorialContent() throws Exception {
        when(tutorialService.getTutorialContent(1L)).thenReturn("# Markdown Content");

        mockMvc.perform(get("/tutorials/file/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("# Markdown Content"));

        verify(tutorialService).getTutorialContent(1L);
    }

    @Test
    void shouldDeleteTutorialSuccessfully() throws Exception {
        String token = "admin-token";
        String filePath = "/path/to/tutorial.md";

        when(userAuthenticationProvider.isUserAdmin(token)).thenReturn(true);
        when(tutorialService.getTutorialFilePath(1L)).thenReturn(filePath);

        try (var mockedFiles = mockStatic(Files.class)) {
            mockedFiles.when(() -> Files.exists(Path.of(filePath))).thenReturn(true);
            mockedFiles.when(() -> Files.delete(Path.of(filePath))).thenAnswer(invocation -> null);

            mockMvc.perform(delete("/tutorials/delete/1")
                            .param("token", token))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Tutorial deleted successfully."));

            verify(userAuthenticationProvider).isUserAdmin(token);
            verify(tutorialService).getTutorialFilePath(1L);
            verify(tutorialService).deleteTutorial(1L);

            mockedFiles.verify(() -> Files.exists(Path.of(filePath)));
            mockedFiles.verify(() -> Files.delete(Path.of(filePath)));
        }
    }

    @Test
    void shouldNotDeleteTutorialIfNotAdmin() throws Exception {
        String token = "user-token";

        when(userAuthenticationProvider.isUserAdmin(token)).thenReturn(false);

        mockMvc.perform(delete("/tutorials/delete/1")
                        .param("token", token))
                .andExpect(status().isForbidden())
                .andExpect(content().string("User not permitted to delete tutorials."));

        verify(userAuthenticationProvider).isUserAdmin(token);
        verify(tutorialService, never()).getTutorialFilePath(anyLong());
        verify(tutorialService, never()).deleteTutorial(anyLong());
    }
}
