package com.sneakerstore.api.repository;

import com.sneakerstore.api.model.SneakerVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SneakerVariantRepository extends JpaRepository<SneakerVariant, Long> {

    // Spring traducirá este nombre de método automáticamente a:
    // SELECT * FROM sneaker_variants WHERE sneaker_id = ?
    List<SneakerVariant> findBySneakerId(Long sneakerId);
}