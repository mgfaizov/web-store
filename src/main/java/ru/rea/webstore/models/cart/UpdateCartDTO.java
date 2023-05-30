package ru.rea.webstore.models.cart;

import lombok.Data;

/** 
 * DTO "Data Transfer Object" (объект передачи данных) 
 * можно использовать для обновления только необходимых полей 
 */

@Data
public class UpdateCartDTO {

    private long id;
    private int quantity;
    private long productId;

}
