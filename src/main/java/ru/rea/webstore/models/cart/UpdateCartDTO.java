package ru.rea.webstore.models.cart;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** 
 * DTO "Data Transfer Object" (объект передачи данных) 
 * можно использовать для обновления только необходимых полей 
 */

@Data
public class UpdateCartDTO {

    private long id;

    @NotBlank(message = "Наименование обязательно")
    private String productName;
    @DecimalMin(value = "0.0", inclusive = false, message = "Цена должна быть больше нуля")
    private Integer price;
    // private String description;

}
