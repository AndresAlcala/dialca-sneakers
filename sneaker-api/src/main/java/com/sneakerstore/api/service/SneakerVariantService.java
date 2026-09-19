package com.sneakerstore.api.service;

import com.sneakerstore.api.model.Sneaker;
import com.sneakerstore.api.model.SneakerVariant;
import com.sneakerstore.api.repository.SneakerRepository;
import com.sneakerstore.api.repository.SneakerVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SneakerVariantService {

    private final SneakerVariantRepository variantRepository;
    private final SneakerRepository sneakerRepository; // Necesitamos este para validar que el tenis exista

    public List<SneakerVariant> getVariantsBySneaker(Long sneakerId) {
        return variantRepository.findBySneakerId(sneakerId);
    }

    public SneakerVariant addVariantToSneaker(Long sneakerId, SneakerVariant variant) {
        // Lógica 1: Validar que el modelo de tenis (el padre) realmente exista
        Sneaker sneaker = sneakerRepository.findById(sneakerId)
                .orElseThrow(() -> new IllegalArgumentException("El tenis con ID " + sneakerId + " no existe."));

        // Lógica 2: Validar que el inventario tenga sentido comercial
        if (variant.getStockQuantity() == null || variant.getStockQuantity() < 0) {
            throw new IllegalArgumentException("El inventario inicial no puede ser negativo.");
        }

        // Relacionamos la talla con su respectivo tenis y guardamos
        variant.setSneaker(sneaker);
        return variantRepository.save(variant);
    }
}