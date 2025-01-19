package com.algovise.repositories;

import com.algovise.entities.Quiz;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Transactional
class QuizRepositoryTest {

    @Autowired
    private QuizRepository quizRepository;

    @Test
    void shouldSaveAndRetrieveQuiz() {
        Quiz quiz = new Quiz();
        quiz.setTitle("Test Quiz");
        quizRepository.save(quiz);

        Optional<Quiz> retrievedQuiz = quizRepository.findById(quiz.getId());

        assertTrue(retrievedQuiz.isPresent());
        assertEquals("Test Quiz", retrievedQuiz.get().getTitle());
    }

    @Test
    void shouldDeleteQuiz() {
        Quiz quiz = new Quiz();
        quiz.setTitle("Quiz to Delete");
        quizRepository.save(quiz);

        assertTrue(quizRepository.findById(quiz.getId()).isPresent());

        quizRepository.deleteById(quiz.getId());

        Optional<Quiz> deletedQuiz = quizRepository.findById(quiz.getId());
        assertFalse(deletedQuiz.isPresent());
    }
}
