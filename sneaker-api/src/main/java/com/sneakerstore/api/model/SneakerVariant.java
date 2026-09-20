package com.sneakerstore.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sneaker_variants")
public class SneakerVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación: Muchas variaciones (tallas) pertenecen a un (1) modelo de tenis
    @ManyToOne
    @JoinColumn(name = "sneaker_id", nullable = false)
    private Sneaker sneaker;

    // La talla del tenis (Ej: "7 US / 40 EUR / 38 COL / 25 CM (MEN)")
    @Column(name = "size_name", nullable = false, length = 150)
    private String size;

    // Campo heredado para evitar el error 500 por la restricción NOT NULL de la BD anterior
    @Column(name = "size", nullable = false)
    private Float legacySize = 0f;

    // El color específico de esta variante (Ej: "Blanco/Negro")
    @Column(nullable = false, length = 50)
    private String color;

    // El inventario real disponible para esta talla y color exacto
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;
}