package ru.rea.webstore.models.user;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
// import lombok.Getter;
// import lombok.Setter;
import ru.rea.webstore.models.cart.Cart;

// модель данных для пользователя
@Entity
@Data
@Table(name = "users")
public class User {

    public User() {
        /** 
         * Если значения role и status не будут установлены явно, 
         * они будут установлены в значения по умолчанию 
         */
        this.role = Role.USER;
        this.status = Status.ACTIVE;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // @Getter @Setter
    private long id;

    @NotBlank(message = "Email обязателен")
    @Pattern(regexp = ".+@.+\\..+", message = "Email недействителен")
    @Column(name = "email")
    // @Getter @Setter
    private String email;

    @NotBlank(message = "Пароль обязателен")
    // @Size(min = 4, max = 10, message = "Пароль должен состоять от 4 до 10 символов")
    // @Getter @Setter
    @Column(name = "password", length = 255)
    private String password;

    @NotNull
    @NotBlank(message = "Имя обязательно")
    @Size(min = 2, max = 30, message = "Имя должно состоять от 2 до 30 символов")
    @Column(name = "first_name")
    // @Getter @Setter
    private String firstName;

    @NotBlank(message = "Фамилия обязательна")
    @Size(min = 2, max = 30, message = "Фамилия должна состоять от 2 до 30 символов")
    @Column(name = "last_name")
    // @Getter @Setter
    private String lastName;

    @Column(name = "patronym")
    // @Getter @Setter
    private String patronym;

    // @NotBlank(message = "Возраст обязателен")
    @Min(value = 18, message = "Возраст должен быть не менее 18 лет")
    @Column(name = "age")
    // @Getter @Setter
    private Integer age;
    
    @NotBlank(message = "Номер телефона обязателен")
    @Size(min = 10, max = 15, message = "Номер телефона должен составлять от 10 до 15")
    @Column(name = "phone_number")
    // @Getter @Setter
    private String phoneNumber;

   /*  @Column(name = "token_key", length = 155)
    private String tokenKey; */

    @Enumerated(value = EnumType.STRING)
    @Column(name = "role")
    // @Getter @Setter
    private Role role;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "status")
    // @Getter @Setter
    private Status status;

    // @OneToMany(mappedBy = "user")
    // private List<Cart> carts;

}