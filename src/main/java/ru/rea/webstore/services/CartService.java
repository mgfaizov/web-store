package ru.rea.webstore.services;

import java.util.List;

import org.springframework.stereotype.Service;

import ru.rea.webstore.models.cart.Cart;
import ru.rea.webstore.models.cart.UpdateCartDTO;
import ru.rea.webstore.repositories.CartRepository;

@Service
public class CartService {
    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public Cart getCartById(Long id) {
        return cartRepository.findById(id).orElse(null);
    }

    public Cart updateCartById(Long id, UpdateCartDTO updateCartDTO) {
        Cart existingCart = cartRepository.findById(id).orElse(null);
        if (existingCart == null) {
            // Обработка ситуации, когда продукт не найден
        }
        // Обновление полей продукта на основе данных из updateProductDTO
        existingCart.setProductName(updateCartDTO.getProductName());
        existingCart.setPrice(updateCartDTO.getPrice());

        return cartRepository.save(existingCart);
    }

    public void deleteCartById(Long id) {
        cartRepository.deleteById(id);
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }
}