package com.algovise.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class SignUpDto {

    @NotEmpty
    private final String name;

    @NotEmpty
    private final String email;

    @NotEmpty
    private final char[] password;
}
