package com.codegraspers.marketplace.service;

import com.codegraspers.marketplace.model.Product;
import com.codegraspers.marketplace.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }


    // Get All Products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductbyID(int id) {
        return productRepository.findById(id).orElse(null);
    }


    // Product Uploading logic with Image Support
    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        if(imageFile != null && !imageFile.isEmpty()){
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
            product.setImageData(imageFile.getBytes());
        }
        return productRepository.save(product);
    }


    // The Product Updating Logic with Image Support
    public Product updateProduct(int id,Product updatedData, MultipartFile imageFile) throws  IOException {
        Product existing = productRepository.findById(id).orElse(null);
        if (existing == null){
            return null;
        }

        existing.setName(updatedData.getName());
        existing.setDescription(updatedData.getDescription());
        existing.setBrand(updatedData.getBrand());
        existing.setPriceUsd(updatedData.getPriceUsd());
        existing.setPriceZig(updatedData.getPriceZig());
        existing.setCategory(updatedData.getCategory());
        existing.setSupplier(updatedData.getSupplier());
        existing.setAvailable(updatedData.isAvailable());
        existing.setQuantity(updatedData.getQuantity());
        existing.setReleaseDate(updatedData.getReleaseDate());

        if (imageFile != null && !imageFile.isEmpty()) {
            existing.setImageName(imageFile.getOriginalFilename());
            existing.setImageType(imageFile.getContentType());
            existing.setImageData(imageFile.getBytes());
        }

        return productRepository.save(existing);
    }

    public void deleteProduct(int id) {
        productRepository.deleteById(id);
    }
}
