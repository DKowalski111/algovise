package com.algovise.configs;

import com.algovise.dtos.ErrorDto;
import com.algovise.exceptions.AppException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler
    @ResponseBody
    public ResponseEntity<ErrorDto> handleException(final AppException e)
    {
        return ResponseEntity
                .status(e.getStatus())
                .body(ErrorDto.builder().message(e.getMessage()).build());
    }
}
