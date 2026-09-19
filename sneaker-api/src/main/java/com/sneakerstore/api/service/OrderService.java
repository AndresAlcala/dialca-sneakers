package com.sneakerstore.api.service;

import com.sneakerstore.api.dto.OrderItemRequest;
import com.sneakerstore.api.dto.OrderRequest;
import com.sneakerstore.api.model.Order;
import com.sneakerstore.api.model.OrderItem;
import com.sneakerstore.api.model.SneakerVariant;
import com.sneakerstore.api.model.User;
import com.sneakerstore.api.repository.OrderRepository;
import com.sneakerstore.api.repository.SneakerVariantRepository;
import com.sneakerstore.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.sneakerstore.api.model.Role;

/**
 * Servicio encargado de la lógica de negocio para las órdenes de compra.
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final SneakerVariantRepository sneakerVariantRepository;
    private final UserRepository userRepository;

    /**
     * Crea una nueva orden de compra, verificando el inventario y reduciendo el stock.
     * Soporta Guest Checkout: Si el correo no existe, crea un usuario invitado.
     * Esta operación es transaccional: si algo falla (ej. falta de stock), no se guarda nada.
     *
     * @param request Datos de la orden (items, dirección y correo)
     * @return La orden creada y guardada
     */
    @Transactional
    public Order createOrder(OrderRequest request) {
        // 1. Obtener al usuario o crear uno invitado si no existe
        User user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    User guestUser = User.builder()
                            .email(request.getEmail())
                            .firstName("Invitado")
                            .lastName("Guest")
                            .password("guest") // Contraseña dummy, no podrá loguearse normalmente
                            .role(Role.CUSTOMER)
                            .build();
                    return userRepository.save(guestUser);
                });

        // 2. Inicializar la nueva orden
        Order order = Order.builder()
                .user(user)
                .status("COMPLETED") // Para este MVP asumimos que el pago es inmediato y exitoso
                .createdAt(LocalDateTime.now())
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;

        // 3. Procesar cada artículo del carrito
        for (OrderItemRequest itemRequest : request.getItems()) {
            // Buscar la variante específica en la base de datos
            SneakerVariant variant = sneakerVariantRepository.findById(itemRequest.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variante de zapatilla no encontrada: " + itemRequest.getVariantId()));

            // Validar que haya stock suficiente
            if (variant.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("No hay stock suficiente para el modelo " + 
                        variant.getSneaker().getName() + " talla " + variant.getSize());
            }

            // Restar el stock
            variant.setStockQuantity(variant.getStockQuantity() - itemRequest.getQuantity());
            // Nota: Al estar en una transacción, Hibernate guardará automáticamente este cambio en 'variant' al finalizar

            // Calcular el subtotal de este artículo y sumarlo al total general
            BigDecimal itemPrice = variant.getSneaker().getPrice();
            BigDecimal subtotal = itemPrice.multiply(new BigDecimal(itemRequest.getQuantity()));
            total = total.add(subtotal);

            // Crear el registro del OrderItem
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .sneakerVariant(variant)
                    .quantity(itemRequest.getQuantity())
                    .priceAtPurchase(itemPrice)
                    .build();

            // Agregar a la orden
            order.getItems().add(orderItem);
        }

        // 4. Asignar el monto total calculado
        order.setTotalAmount(total);

        // 5. Guardar la orden (y por CascadeType.ALL, guardará también los OrderItems)
        return orderRepository.save(order);
    }
}
