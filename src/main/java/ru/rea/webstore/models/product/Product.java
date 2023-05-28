package ru.rea.webstore.models.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "Наименование обязательно")
    @Column(name = "product_name")
    private String productName;

    @DecimalMin(value = "0.0", inclusive = false, message = "Цена должна быть больше нуля")
    @Column(name = "price")
    private Integer price;

    /* @NotBlank(message = "Описание обязательно")
    @Column(name = "description")
    private String description; */

}
