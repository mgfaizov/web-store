package ru.rea.webstore.models.user;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

/** 
 * DTO "Data Transfer Object" (объект передачи данных) 
 * можно использовать для обновления только необходимых полей 
 */

@Data
public class UpdateUserDTO {

    public UpdateUserDTO() {
        /** 
         * Если значения role и status не будут установлены явно, 
         * они будут установлены в значения по умолчанию 
         */
        this.role = Role.USER;
        this.status = Status.ACTIVE;
    }

    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    @NotBlank(message = "Имя обязательно")
    @Size(min = 2, max = 30, message = "Имя должно состоять от 2 до 30 символов")
    private String firstName;

    @NotNull
    @NotBlank(message = "Фамилия обязательна")
    @Size(min = 2, max = 30, message = "Фамилия должна состоять от 2 до 30 символов")
    private String lastName;

    // @Column(name = "patronym")
    private String patronym;

    @Min(value = 18, message = "Возраст должен быть не менее 18 лет")
    private Integer age;

    @NotNull
    @NotBlank(message = "Email обязателен")
    @Pattern(regexp = ".+@.+\\..+", message = "Email недействителен")
    private String email;

    @NotNull
    @NotBlank(message = "Номер телефона обязателен")
    @Size(min = 10, max = 15, message = "Номер телефона должен составлять от 10 до 15 символов")
    private String phoneNumber;

    @Enumerated(value = EnumType.STRING)
    // @Column(name = "role")
    private Role role;

    @Enumerated(value = EnumType.STRING)
    // @Column(name = "status")
    private Status status;

    // private Role role;
    // private Status status;
}
