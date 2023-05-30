package ru.rea.webstore.services;

import java.util.List;

import org.springframework.stereotype.Service;

import ru.rea.webstore.models.product.Product;
import ru.rea.webstore.models.product.UpdateProductDTO;
import ru.rea.webstore.repositories.ProductRepository;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // public Product getProductByName(String productName) {
    //     return productRepository.findByProductName(productName);
    // }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product updateProductById(Long id, UpdateProductDTO updateProductDTO) {
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct == null) {
            // Обработка ситуации, когда продукт не найден
        }
        // Обновление полей продукта на основе данных из updateProductDTO
        existingProduct.setProductName(updateProductDTO.getProductName());
        existingProduct.setPrice(updateProductDTO.getPrice());

        return productRepository.save(existingProduct);
    }

    public void deleteProductById(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}