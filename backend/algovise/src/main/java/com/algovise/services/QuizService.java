package com.algovise.services;

import com.algovise.dtos.QuizDto;
import com.algovise.entities.Quiz;
import com.algovise.repositories.QuizRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {
    @Value("${quiz.upload.dir}")
    private String uploadDir;

    private final QuizRepository quizRepository;

    public QuizService(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    public List<QuizDto> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(quiz -> new QuizDto(quiz.getId(), quiz.getTitle()))
                .collect(Collectors.toList());
    }

    public String getQuizContent(Long id) throws IOException {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        Path filePath = Paths.get(quiz.getFilePath());
        return Files.readString(filePath);
    }

//    public void saveQuiz(QuizDto quizDto, String jsonContent) throws IOException {
//        Path directory = Paths.get(uploadDir);
//        if (!Files.exists(directory)) {
//            Files.createDirectories(directory);
//        }
//
//        String fileName = quizDto.getTitle().replaceAll("\\s+", "_") + ".json";
//        Path filePath = directory.resolve(fileName);
//        Files.writeString(filePath, jsonContent);
//
//        Quiz quiz = new Quiz();
//        quiz.setTitle(quizDto.getTitle());
//        quiz.setFilePath(filePath.toString());
//
//        quizRepository.save(quiz);
//    }

    public void saveQuiz(String title, String filePath) {
        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setFilePath(filePath);

        System.out.println("Saving quiz - " + quiz);
        quizRepository.save(quiz);
    }
}
