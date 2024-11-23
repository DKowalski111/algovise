package com.algovise.controllers;

import com.algovise.services.UserCompletedQuizzesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/completed-quizzes")
public class UserCompletedQuizzesController {
    private final UserCompletedQuizzesService service;

    public UserCompletedQuizzesController(UserCompletedQuizzesService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> markQuizAsCompleted(
            @RequestParam Long userId,
            @RequestParam Long quizId
    ) {
        if(!service.isQuizAlreadyCompleted(userId, quizId)) {
            service.saveCompletedQuiz(userId, quizId);
        }
        return ResponseEntity.ok("Quiz marked as completed.");
    }

    @GetMapping
    public ResponseEntity<Boolean> isQuizCompleted(
            @RequestParam Long userId,
            @RequestParam Long quizId
    ) {
        boolean completed = service.isQuizAlreadyCompleted(userId, quizId);
        return ResponseEntity.ok(completed);
    }
}
