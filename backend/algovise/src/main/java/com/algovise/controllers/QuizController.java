package com.algovise.controllers;

import com.algovise.configs.UserAuthenticationProvider;
import com.algovise.dtos.QuizDto;
import com.algovise.services.QuizService;
import com.algovise.services.UserCompletedQuizzesService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/quizzes")
public class QuizController {
    private final QuizService quizService;
    private final UserCompletedQuizzesService userCompletedQuizzesService;
    private final UserAuthenticationProvider userAuthenticationProvider;

    @Value("${quiz.upload.dir}")
    private String uploadDir;

    public QuizController(QuizService quizService, UserCompletedQuizzesService userCompletedQuizzesService, UserAuthenticationProvider userAuthenticationProvider)
    {
        this.quizService = quizService;
        this.userCompletedQuizzesService = userCompletedQuizzesService;
        this.userAuthenticationProvider = userAuthenticationProvider;
    }

    @GetMapping("/list")
    public ResponseEntity<List<QuizDto>> getAllQuizzes() {
        List<QuizDto> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addQuiz( @RequestParam("title") String title, @RequestParam("file") MultipartFile file,
                                           @RequestParam("token") String token) {
        if(!userAuthenticationProvider.isUserAdmin(token))
        {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not permitted to add new quiz.");
        }

        if (!Objects.requireNonNull(file.getOriginalFilename()).endsWith(".json")) {
            return ResponseEntity.badRequest().body("Only JSON files are allowed.");
        }

        try {
            Path directory = Paths.get(uploadDir);
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }

            String fileName = file.getOriginalFilename();
            Path filePath = directory.resolve(fileName);
            Files.write(filePath, file.getBytes());

            quizService.saveQuiz(title, filePath.toString());

            return ResponseEntity.ok("Quiz saved successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving quiz: " + e.getMessage());
        }
    }

    @GetMapping("/file/{quizId}")
    public ResponseEntity<String> getQuiz(@PathVariable Long quizId) {
        try {
            String content = quizService.getQuizContent(quizId);
            return ResponseEntity.ok(content);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error reading quiz: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{quizId}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long quizId, @RequestParam("token") String token) {
        if (!userAuthenticationProvider.isUserAdmin(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not permitted to delete quizzes.");
        }

        try {
            String filePath = quizService.getQuizFilePath(quizId);

            Path path = Paths.get(filePath);
            if (Files.exists(path)) {
                Files.delete(path);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Quiz file not found.");
            }

            quizService.deleteQuiz(quizId);
            userCompletedQuizzesService.deleteQuiz(quizId);

            return ResponseEntity.ok("Quiz deleted successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting quiz: " + e.getMessage());
        }
    }
}
