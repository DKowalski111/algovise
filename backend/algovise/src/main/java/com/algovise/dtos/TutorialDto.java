package com.algovise.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class TutorialDto {
    private Long id;
    private String title;
}
