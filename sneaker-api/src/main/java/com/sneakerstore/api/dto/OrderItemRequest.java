package com.sneakerstore.api.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

/**
 * DTO para recibir la información de un artículo específico dentro de la orden.
 */
@Data
public class OrderItemRequest {
    
    // ID de la variante de zapatilla (talla/color específico) que se está comprando
    @NotNull(message = "El ID de la variante es obligatorio")
    private Long variantId;
    
    // Cantidad de pares de esta variante
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer quantity;
}
