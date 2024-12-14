package com.algovise.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EdgeDto
{
    private Long id;
    private Long sourceId;
    private Long targetId;
    private Double weight;
}
