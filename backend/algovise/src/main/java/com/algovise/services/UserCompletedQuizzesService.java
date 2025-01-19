package com.algovise.services;

import com.algovise.entities.UserCompletedQuizzes;
import com.algovise.repositories.UserCompletedQuizzesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserCompletedQuizzesService {

    private final UserCompletedQuizzesRepository repository;

    public UserCompletedQuizzesService(UserCompletedQuizzesRepository repository) {
        this.repository = repository;
    }

    public boolean isQuizAlreadyCompleted(Long userId, Long quizId) {
        return repository.existsByUserIdAndQuizId(userId, quizId);
    }

    public void saveCompletedQuiz(Long userId, Long quizId) {
        if (!isQuizAlreadyCompleted(userId, quizId)) {
            UserCompletedQuizzes completedQuiz = new UserCompletedQuizzes();
            completedQuiz.setUserId(userId);
            completedQuiz.setQuizId(quizId);
            repository.save(completedQuiz);
        }
    }

    public void deleteQuiz(Long quizId)
    {
        List<UserCompletedQuizzes> userCompletedQuizzesList = repository.findAll();
        for(UserCompletedQuizzes userCompletedQuizzes : userCompletedQuizzesList)
        {
            if(userCompletedQuizzes.getQuizId().equals(quizId))
            {
                repository.delete(userCompletedQuizzes);
            }
        }
    }
}
