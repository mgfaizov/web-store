package ru.rea.webstore.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ru.rea.webstore.models.cart.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
    // Дополнительные методы для работы с товарами
    // Определите пользовательский метод для удаления товара по идентификатору продукта
    @Modifying
    @Query("DELETE FROM Cart c WHERE c.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);
}
