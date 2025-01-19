package com.algovise.services;

import com.algovise.dtos.TutorialDto;
import com.algovise.entities.Tutorial;
import com.algovise.repositories.TutorialRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TutorialService {
    private final TutorialRepository tutorialRepository;

    public TutorialService(TutorialRepository TutorialRepository) {
        this.tutorialRepository = TutorialRepository;
    }

    public List<TutorialDto> getAllTutorials() {
        return tutorialRepository.findAll().stream()
                .map(tutorial -> new TutorialDto(tutorial.getId(), tutorial.getTitle()))
                .collect(Collectors.toList());
    }

    public String getTutorialContent(Long id) throws IOException {
        Tutorial tutorial = tutorialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutorial not found"));
        Path filePath = Paths.get(tutorial.getFilePath());
        return Files.readString(filePath);
    }

    public void saveTutorial(String title, String filePath) {
        Tutorial tutorial = new Tutorial();
        tutorial.setTitle(title);
        tutorial.setFilePath(filePath);

        tutorialRepository.save(tutorial);
    }
    public String getTutorialFilePath(Long tutorialId) {
        return tutorialRepository.findById(tutorialId)
                .map(Tutorial::getFilePath)
                .orElseThrow(() -> new RuntimeException("Tutorial not found with ID: " + tutorialId));
    }
    public void deleteTutorial(Long tutorialId) {
        tutorialRepository.deleteById(tutorialId);
    }
}
