package ru.rea.webstore.services;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import ru.rea.webstore.models.cart.Cart;
import ru.rea.webstore.models.cart.UpdateCartDTO;
import ru.rea.webstore.models.product.Product;
import ru.rea.webstore.repositories.CartRepository;
import ru.rea.webstore.repositories.ProductRepository;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public Cart getCartById(Long id) {
        return cartRepository.findById(id).orElse(null);
    }

    // public Product getProductByName(String productName) {
    //     return productRepository.findByProductName(productName);
    // }

    public Cart updateCartById(Long id, UpdateCartDTO updateCartDTO) {
        Cart existingCart = cartRepository.findById(id).orElse(null);
        if (existingCart == null) {
            // Обработка ситуации, когда корзина не найдена
        }

        Product product = productRepository.findById(updateCartDTO.getProductId()).orElse(null);
        if (product == null) {
            // Обработка ситуации, когда продукт не найден
        }

        existingCart.setProduct(product);
        existingCart.setQuantity(updateCartDTO.getQuantity());

        return cartRepository.save(existingCart);
    }

    @Transactional
    public void removeProductFromCart(Long productId) {
        cartRepository.deleteByProductId(productId);
    }

    // public void removeProductFromCart(Long productId) {
    //     cartRepository.deleteById(productId);
    // }

    // public void removeProductFromCart(Long cartId) {
    //     cartRepository.deleteById(cartId);
    // }

    public void deleteCartById(Long id) {
        cartRepository.deleteById(id);
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }
}