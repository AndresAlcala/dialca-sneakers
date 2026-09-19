package com.sneakerstore.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa una orden de compra en el sistema.
 */
@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con el usuario que realiza la orden
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    // Monto total de la orden
    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    // Estado de la orden (ej. PENDING, COMPLETED, CANCELLED)
    @Column(nullable = false)
    private String status;

    // Fecha y hora en que se creó la orden
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Relación con los items de la orden (cascade ALL para guardar los items junto con la orden)
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();
}
