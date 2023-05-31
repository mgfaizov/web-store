package ru.rea.webstore.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ru.rea.webstore.models.cart.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
    // Дополнительные методы для работы с товарами
    // Метод для удаления товара по идентификатору продукта
    @Modifying
    @Query("DELETE FROM Cart c WHERE c.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);

    // @Query("SELECT COUNT(c) > 0 FROM Cart c WHERE c.product.id = :productId AND c.user.id = :userId")
    // boolean checkProductInCartForUser(@Param("productId") Long productId, @Param("userId") Long userId);
}
