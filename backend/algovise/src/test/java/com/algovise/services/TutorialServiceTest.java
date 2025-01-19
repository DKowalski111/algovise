package com.algovise.services;

import com.algovise.dtos.TutorialDto;
import com.algovise.entities.Tutorial;
import com.algovise.repositories.TutorialRepository;
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

class TutorialServiceTest {

    @Mock
    private TutorialRepository tutorialRepository;

    @InjectMocks
    private TutorialService tutorialService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldGetAllTutorials() {
        Tutorial tutorial1 = new Tutorial();
        tutorial1.setId(1L);
        tutorial1.setTitle("Tutorial 1");

        Tutorial tutorial2 = new Tutorial();
        tutorial2.setId(2L);
        tutorial2.setTitle("Tutorial 2");

        when(tutorialRepository.findAll()).thenReturn(List.of(tutorial1, tutorial2));

        List<TutorialDto> tutorials = tutorialService.getAllTutorials();

        assertEquals(2, tutorials.size());
        assertEquals("Tutorial 1", tutorials.get(0).getTitle());
        assertEquals("Tutorial 2", tutorials.get(1).getTitle());
        verify(tutorialRepository).findAll();
    }

    @Test
    void shouldGetTutorialContent() throws IOException {
        Tutorial tutorial = new Tutorial();
        tutorial.setId(1L);
        tutorial.setFilePath("/path/to/tutorial.txt");

        when(tutorialRepository.findById(1L)).thenReturn(Optional.of(tutorial));
        Path mockPath = Path.of(tutorial.getFilePath());
        String mockContent = "This is the tutorial content.";
        mockStatic(Files.class);
        when(Files.readString(mockPath)).thenReturn(mockContent);

        String content = tutorialService.getTutorialContent(1L);

        assertEquals(mockContent, content);
        verify(tutorialRepository).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenTutorialNotFoundForContent() {
        when(tutorialRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> tutorialService.getTutorialContent(1L));

        assertEquals("Tutorial not found", exception.getMessage());
        verify(tutorialRepository).findById(1L);
    }

    @Test
    void shouldSaveTutorial() {
        tutorialService.saveTutorial("New Tutorial", "/path/to/new_tutorial.txt");

        verify(tutorialRepository).save(argThat(tutorial ->
                tutorial.getTitle().equals("New Tutorial") && tutorial.getFilePath().equals("/path/to/new_tutorial.txt")));
    }

    @Test
    void shouldGetTutorialFilePath() {
        Tutorial tutorial = new Tutorial();
        tutorial.setId(1L);
        tutorial.setFilePath("/path/to/tutorial.txt");

        when(tutorialRepository.findById(1L)).thenReturn(Optional.of(tutorial));

        String filePath = tutorialService.getTutorialFilePath(1L);

        assertEquals("/path/to/tutorial.txt", filePath);
        verify(tutorialRepository).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenTutorialNotFoundForFilePath() {
        when(tutorialRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> tutorialService.getTutorialFilePath(1L));

        assertEquals("Tutorial not found with ID: 1", exception.getMessage());
        verify(tutorialRepository).findById(1L);
    }

    @Test
    void shouldDeleteTutorial() {
        tutorialService.deleteTutorial(1L);

        verify(tutorialRepository).deleteById(1L);
    }
}
