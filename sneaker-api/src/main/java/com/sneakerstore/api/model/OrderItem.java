package com.sneakerstore.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;

/**
 * Entidad que representa un artículo específico dentro de una orden de compra.
 */
@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con la orden principal a la que pertenece este artículo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Order order;

    // Relación con la variante específica de la zapatilla que se compró (color, talla)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private SneakerVariant sneakerVariant;

    // Cantidad de unidades compradas de esta variante específica
    @Column(nullable = false)
    private Integer quantity;

    // Precio de la zapatilla al momento de la compra (dato histórico inmutable)
    @Column(name = "price_at_purchase", nullable = false)
    private BigDecimal priceAtPurchase;
}
