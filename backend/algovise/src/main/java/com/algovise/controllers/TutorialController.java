package com.algovise.controllers;

import com.algovise.configs.UserAuthenticationProvider;
import com.algovise.dtos.TutorialDto;
import com.algovise.services.TutorialService;
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
@RequestMapping("/tutorials")
public class TutorialController {
    private final TutorialService tutorialService;
    private final UserAuthenticationProvider userAuthenticationProvider;

    @Value("${tutorial.upload.dir}")
    private String uploadDir;

    public TutorialController(TutorialService tutorialService, UserAuthenticationProvider userAuthenticationProvider)
    {
        this.tutorialService = tutorialService;
        this.userAuthenticationProvider = userAuthenticationProvider;
    }

    @GetMapping("/list")
    public ResponseEntity<List<TutorialDto>> getAllTutorials() {
        List<TutorialDto> tutorials = tutorialService.getAllTutorials();
        return ResponseEntity.ok(tutorials);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addTutorial(@RequestParam("title") String title, @RequestParam("file") MultipartFile file,
                                          @RequestParam("token") String token) {
        if(!userAuthenticationProvider.isUserAdmin(token))
        {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not permitted to add new tutorial.");
        }

        if (!Objects.requireNonNull(file.getOriginalFilename()).endsWith(".md")) {
            return ResponseEntity.badRequest().body("Only MD files are allowed.");
        }

        try {
            Path directory = Paths.get(uploadDir);
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }

            String fileName = file.getOriginalFilename();
            Path filePath = directory.resolve(fileName);
            Files.write(filePath, file.getBytes());

            tutorialService.saveTutorial(title, filePath.toString());

            return ResponseEntity.ok("Tutorial saved successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving tutorial: " + e.getMessage());
        }
    }

    @GetMapping("/file/{tutorialId}")
    public ResponseEntity<String> getTutorial(@PathVariable Long tutorialId) {
        try {
            String content = tutorialService.getTutorialContent(tutorialId);
            return ResponseEntity.ok(content);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error reading tutorial: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{tutorialId}")
    public ResponseEntity<String> deleteTutorial(@PathVariable Long tutorialId, @RequestParam("token") String token) {
        if (!userAuthenticationProvider.isUserAdmin(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not permitted to delete tutorials.");
        }

        try {
            String filePath = tutorialService.getTutorialFilePath(tutorialId);

            Path path = Paths.get(filePath);
            if (Files.exists(path)) {
                Files.delete(path);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tutorial file not found.");
            }

            tutorialService.deleteTutorial(tutorialId);

            return ResponseEntity.ok("Tutorial deleted successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting tutorial: " + e.getMessage());
        }
    }
}
