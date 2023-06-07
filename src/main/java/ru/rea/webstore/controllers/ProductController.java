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

import ru.rea.webstore.models.product.Product;
import ru.rea.webstore.models.product.UpdateProductDTO;
import ru.rea.webstore.services.CartService;
import ru.rea.webstore.services.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;
    private final CartService cartService;

    public ProductController(ProductService productService, CartService cartService) {
        this.productService = productService;
        this.cartService = cartService;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> createProduct(@Valid @RequestBody Product product, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        } else {
            Product savedProduct = productService.createProduct(product);
            return ResponseEntity.ok(savedProduct);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable("id") long id) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    @GetMapping("/check/{id}")
    public ResponseEntity<?> checkCartById(@PathVariable("id") long id) {
        // Ваша логика для проверки корзины по идентификатору
        // Например, cartService.checkCartById(id)
        boolean isCartValid = cartService.checkCartById(id);

        /* if (isCartValid) {
            return ResponseEntity.ok("Cart is valid");
        } else {
            return ResponseEntity.ok("Cart is invalid");
        } */

        return ResponseEntity.ok(isCartValid);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> productList = productService.getAllProducts();
        return ResponseEntity.ok(productList);
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable("id") Long id,
            @Valid @RequestBody UpdateProductDTO updateProductDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        } else {
            Product updatedProduct = productService.updateProductById(id, updateProductDTO);
            return ResponseEntity.ok(updatedProduct);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Long id) {
        productService.deleteProductById(id);
        return ResponseEntity.ok().build();
    }
}