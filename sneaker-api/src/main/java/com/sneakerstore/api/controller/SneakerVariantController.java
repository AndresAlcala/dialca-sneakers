package com.sneakerstore.api.controller;

import com.sneakerstore.api.model.SneakerVariant;
import com.sneakerstore.api.service.SneakerVariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sneakers/{sneakerId}/variants") // Ruta anidada: /api/sneakers/1/variants
@RequiredArgsConstructor
public class SneakerVariantController {

    private final SneakerVariantService variantService;

    // Listar todas las tallas y colores de un tenis específico
    @GetMapping
    public ResponseEntity<List<SneakerVariant>> getVariants(@PathVariable Long sneakerId) {
        return ResponseEntity.ok(variantService.getVariantsBySneaker(sneakerId));
    }

    // Agregar una nueva talla/color con su inventario a un tenis
    @PostMapping
    public ResponseEntity<SneakerVariant> addVariant(
            @PathVariable Long sneakerId,
            @RequestBody SneakerVariant variant) {

        SneakerVariant savedVariant = variantService.addVariantToSneaker(sneakerId, variant);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedVariant);
    }
}