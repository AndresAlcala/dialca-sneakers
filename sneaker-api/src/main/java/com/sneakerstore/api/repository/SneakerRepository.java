package com.sneakerstore.api.repository;

import com.sneakerstore.api.model.Sneaker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SneakerRepository extends JpaRepository<Sneaker, Long> {
    // Al heredar de JpaRepository, Spring nos regala automáticamente métodos como:
    // save(), findAll(), findById(), deleteById()
    // No necesitamos escribir ni una sola línea de SQL.
}