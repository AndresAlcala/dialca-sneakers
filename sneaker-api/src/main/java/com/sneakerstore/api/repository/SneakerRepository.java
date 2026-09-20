package com.sneakerstore.api.repository;

import com.sneakerstore.api.model.Sneaker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SneakerRepository extends JpaRepository<Sneaker, Long> {
    
    // Devuelve solo las zapatillas que NO han sido borradas de forma lógica
    List<Sneaker> findByIsActiveTrue();
}