package com.sneakerstore.api.dto;

import lombok.Data;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import jakarta.validation.Valid;

/**
 * DTO para recibir la información de una orden completa desde el frontend.
 */
@Data
public class OrderRequest {
    
    // Lista de artículos que el usuario desea comprar (el contenido del carrito)
    @NotEmpty(message = "La orden debe contener al menos un artículo")
    @Valid
    private List<OrderItemRequest> items;
    
    // Dirección de envío (opcional, simulada por ahora)
    private String shippingAddress;
    
    // Correo electrónico del cliente (necesario para Guest Checkout)
    @NotEmpty(message = "El correo es obligatorio para realizar la compra")
    private String email;
}
