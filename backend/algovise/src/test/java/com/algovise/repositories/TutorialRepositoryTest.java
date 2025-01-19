package com.algovise.repositories;

import com.algovise.entities.Tutorial;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Transactional
class TutorialRepositoryTest {

    @Autowired
    private TutorialRepository tutorialRepository;

    @Test
    void shouldSaveAndRetrieveTutorial() {
        Tutorial tutorial = new Tutorial();
        tutorial.setTitle("Sample Tutorial");
        tutorial.setFilePath("/path/to/sample.pdf");
        tutorialRepository.save(tutorial);

        Optional<Tutorial> retrievedTutorial = tutorialRepository.findById(tutorial.getId());

        assertTrue(retrievedTutorial.isPresent());
        assertEquals("Sample Tutorial", retrievedTutorial.get().getTitle());
        assertEquals("/path/to/sample.pdf", retrievedTutorial.get().getFilePath());
    }

    @Test
    void shouldDeleteTutorialById() {
        Tutorial tutorial = new Tutorial();
        tutorial.setTitle("Tutorial to Delete");
        tutorial.setFilePath("/path/to/delete.pdf");
        tutorialRepository.save(tutorial);

        assertTrue(tutorialRepository.findById(tutorial.getId()).isPresent());

        tutorialRepository.deleteById(tutorial.getId());

        Optional<Tutorial> deletedTutorial = tutorialRepository.findById(tutorial.getId());
        assertFalse(deletedTutorial.isPresent());
    }
}
