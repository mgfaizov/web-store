package ru.rea.webstore.controllers;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AuthenticationRequestDTO {
    @NotBlank(message = "Email обязателен")
    @Pattern(regexp = ".+@.+\\..+", message = "Email недействителен")
    private String email;
    @NotBlank(message = "Пароль обязателен")
    private String password;
}
