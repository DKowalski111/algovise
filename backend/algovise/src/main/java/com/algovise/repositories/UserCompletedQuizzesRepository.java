package com.algovise.repositories;

import com.algovise.entities.UserCompletedQuizzes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCompletedQuizzesRepository extends JpaRepository<UserCompletedQuizzes, Long> {
    boolean existsByUserIdAndQuizId(Long userId, Long quizId);
}
