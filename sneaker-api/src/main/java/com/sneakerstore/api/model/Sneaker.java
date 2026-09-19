package com.sneakerstore.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data // Lombok: Genera automáticamente getters, setters, toString y equals
@NoArgsConstructor // Lombok: Constructor vacío (obligatorio para Spring Data JPA)
@AllArgsConstructor // Lombok: Constructor con todos los atributos
@Entity // JPA: Indica que esta clase será una tabla en PostgreSQL
@Table(name = "sneakers") // JPA: Nombra explícitamente la tabla en plural
public class Sneaker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name; // Ej: "Air Force 1 '07"

    @Column(nullable = false, length = 50)
    private String brand; // Ej: "Nike"

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price; // Manejo exacto para dinero

    @Column(length = 1000)
    private String description;

    @Column(name = "image_url")
    private String imageUrl; // Aquí guardaremos el enlace a tu almacenamiento en la nube después
}
