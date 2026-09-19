package com.sneakerstore.api.controller;

import com.sneakerstore.api.model.Sneaker;
import com.sneakerstore.api.service.SneakerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sneakers") // Define la ruta base para todos los métodos aquí adentro
@RequiredArgsConstructor
public class SneakerController {

    private final SneakerService sneakerService;

    // Endpoint para listar todos los tenis (GET)
    @GetMapping
    public ResponseEntity<List<Sneaker>> getAllSneakers() {
        return ResponseEntity.ok(sneakerService.getAllSneakers());
    }

    // Endpoint para guardar unos nuevos tenis (POST)
    @PostMapping
    public ResponseEntity<Sneaker> createSneaker(@RequestBody Sneaker sneaker) {
        Sneaker savedSneaker = sneakerService.createSneaker(sneaker);
        // Devuelve un código 201 (Created) junto con el tenis guardado
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSneaker);
    }

    // Endpoint para actualizar unos tenis existentes (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Sneaker> updateSneaker(@PathVariable Long id, @RequestBody Sneaker sneakerDetails) {
        Sneaker updatedSneaker = sneakerService.updateSneaker(id, sneakerDetails);
        return ResponseEntity.ok(updatedSneaker);
    }
}