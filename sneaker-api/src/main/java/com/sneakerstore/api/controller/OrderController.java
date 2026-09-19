package com.sneakerstore.api.controller;

import com.sneakerstore.api.dto.OrderRequest;
import com.sneakerstore.api.model.Order;
import com.sneakerstore.api.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para manejar las peticiones relacionadas con órdenes de compra.
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permite peticiones desde el frontend (CORS)
public class OrderController {

    private final OrderService orderService;

    /**
     * Endpoint para crear una nueva orden de compra.
     * Ahora es PÚBLICO para soportar el Checkout de invitados.
     *
     * @param request Datos de la orden enviados desde el frontend, incluyendo el correo
     * @return La orden creada con estado 200 OK, o un error si no hay stock
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest request) {
        try {
            // Llamar al servicio para procesar y guardar la orden
            Order newOrder = orderService.createOrder(request);
            
            return ResponseEntity.ok(newOrder);
        } catch (RuntimeException e) {
            // En caso de que falle la validación de stock
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Cualquier otro error del servidor
            return ResponseEntity.internalServerError().body("Error al procesar la orden: " + e.getMessage());
        }
    }
}
