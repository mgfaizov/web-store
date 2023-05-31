package ru.rea.webstore.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ru.rea.webstore.models.cart.Cart;
import ru.rea.webstore.models.cart.UpdateCartDTO;
import ru.rea.webstore.services.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> createCart(@Valid @RequestBody Cart cart, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        } else {
            Cart savedCart = cartService.createCart(cart);
            return ResponseEntity.ok(savedCart);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cart> getCartById(@PathVariable("id") long id) {
        Cart cart = cartService.getCartById(id);
        if (cart == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Cart>> getAllCarts() {
        List<Cart> cartList = cartService.getAllCarts();
        return ResponseEntity.ok(cartList);
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> updateCart(@PathVariable("id") Long id, @Valid @RequestBody UpdateCartDTO updateCartDTO,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        } else {
            Cart updatedCart = cartService.updateCartById(id, updateCartDTO);
            return ResponseEntity.ok(updatedCart);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeProductFromCart(@PathVariable("id") Long id) {
        cartService.removeProductFromCart(id);
        return ResponseEntity.ok().build();
    }

    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> removeProductFromCart(@RequestParam("id") Long id) {
    // cartService.removeProductFromCart(id);
    // return ResponseEntity.ok().build();
    // }

}