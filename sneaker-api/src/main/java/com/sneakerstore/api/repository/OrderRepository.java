package com.sneakerstore.api.repository;

import com.sneakerstore.api.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la gestión de órdenes en la base de datos.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Encuentra todas las órdenes de un usuario específico
    List<Order> findByUserId(Long userId);
}
