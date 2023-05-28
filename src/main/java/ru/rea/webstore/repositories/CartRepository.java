package ru.rea.webstore.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ru.rea.webstore.models.cart.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
    // Дополнительные методы для работы с товарами
}
