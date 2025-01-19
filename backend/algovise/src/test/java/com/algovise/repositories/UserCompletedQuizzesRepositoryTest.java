package com.algovise.repositories;

import com.algovise.entities.UserCompletedQuizzes;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Transactional
class UserCompletedQuizzesRepositoryTest {

    @Autowired
    private UserCompletedQuizzesRepository userCompletedQuizzesRepository;

    @Test
    void shouldSaveAndRetrieveUserCompletedQuizzes() {
        UserCompletedQuizzes completedQuiz = new UserCompletedQuizzes();
        completedQuiz.setUserId(1L);
        completedQuiz.setQuizId(101L);
        userCompletedQuizzesRepository.save(completedQuiz);

        boolean exists = userCompletedQuizzesRepository.existsByUserIdAndQuizId(1L, 101L);

        assertTrue(exists);
    }

    @Test
    void shouldReturnFalseIfUserQuizDoesNotExist() {
        boolean exists = userCompletedQuizzesRepository.existsByUserIdAndQuizId(1L, 999L);

        assertFalse(exists);
    }

    @Test
    void shouldDeleteUserCompletedQuiz() {
        UserCompletedQuizzes completedQuiz = new UserCompletedQuizzes();
        completedQuiz.setUserId(2L);
        completedQuiz.setQuizId(102L);
        userCompletedQuizzesRepository.save(completedQuiz);

        assertTrue(userCompletedQuizzesRepository.existsByUserIdAndQuizId(2L, 102L));

        userCompletedQuizzesRepository.delete(completedQuiz);

        assertFalse(userCompletedQuizzesRepository.existsByUserIdAndQuizId(2L, 102L));
    }
}
