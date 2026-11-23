package com.codegraspers.marketplace.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "prod_name", nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private String brand;

    @Column(name = "price_usd", precision = 10, scale = 2)
    private BigDecimal priceUsd;

    @Column(name = "price_zig", precision = 12, scale = 2)
    private BigDecimal priceZig;

    private String category;

    private String supplier;

    @Column(name = "is_available", nullable = false)
    private boolean available;

    private int quantity;

    @Column(name = "release_date")
    private LocalDateTime releaseDate;

    @Column(name = "image_name")
    private String imageName;

    @Column(name= "image_type")
    private  String imageType;

    @Column(name = "image_data", columnDefinition = "BYTEA")
    private byte[] imageData;

}