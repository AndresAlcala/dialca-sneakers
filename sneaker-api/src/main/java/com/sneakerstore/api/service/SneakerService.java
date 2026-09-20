package com.sneakerstore.api.service;

import com.sneakerstore.api.model.Sneaker;
import com.sneakerstore.api.repository.SneakerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service // Le dice a Spring que esta clase es un componente de lógica de negocio
@RequiredArgsConstructor // Lombok: Crea automáticamente el constructor para inyectar dependencias
                         // (mejores prácticas)
public class SneakerService {

    // Al ser 'final', obligamos a que se inyecte al crear el servicio
    private final SneakerRepository sneakerRepository;

    public List<Sneaker> getAllSneakers() {
        return sneakerRepository.findByIsActiveTrue();
    }

    public Sneaker createSneaker(Sneaker sneaker) {
        // Lógica de negocio 1: Validar que el precio sea mayor a cero
        if (sneaker.getPrice() == null || sneaker.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio de los tenis debe ser mayor a cero.");
        }

        // Lógica de negocio 2: Formatear el nombre (Ej: quitar espacios extra al inicio
        // y final)
        if (sneaker.getName() != null) {
            sneaker.setName(sneaker.getName().trim());
        }

        // Si pasa las reglas, le decimos al repositorio que lo guarde en PostgreSQL
        return sneakerRepository.save(sneaker);
    }

    public Sneaker updateSneaker(Long id, Sneaker sneakerDetails) {
        Sneaker existingSneaker = sneakerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zapatilla no encontrada con el ID: " + id));

        if (sneakerDetails.getPrice() != null && sneakerDetails.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio de los tenis debe ser mayor a cero.");
        }

        existingSneaker.setName(sneakerDetails.getName() != null ? sneakerDetails.getName().trim() : existingSneaker.getName());
        existingSneaker.setBrand(sneakerDetails.getBrand() != null ? sneakerDetails.getBrand() : existingSneaker.getBrand());
        existingSneaker.setDescription(sneakerDetails.getDescription() != null ? sneakerDetails.getDescription() : existingSneaker.getDescription());
        existingSneaker.setPrice(sneakerDetails.getPrice() != null ? sneakerDetails.getPrice() : existingSneaker.getPrice());
        existingSneaker.setImageUrl(sneakerDetails.getImageUrl() != null ? sneakerDetails.getImageUrl() : existingSneaker.getImageUrl());

        return sneakerRepository.save(existingSneaker);
    }

    public void archiveSneaker(Long id) {
        Sneaker existingSneaker = sneakerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zapatilla no encontrada con el ID: " + id));
        existingSneaker.setActive(false);
        sneakerRepository.save(existingSneaker);
    }
}