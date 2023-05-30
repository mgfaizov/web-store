package ru.rea.webstore.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ru.rea.webstore.models.product.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Дополнительные методы для работы с товарами
    // Product findByProductName(String productName);
}
