package com.sneakerstore.api.repository;

import com.sneakerstore.api.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para la gestión de los detalles (items) de las órdenes.
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
