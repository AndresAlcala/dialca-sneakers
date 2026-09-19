import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Inicializar carrito desde localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Estado para controlar si el cajón del carrito está abierto
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (sneaker, variant, quantityToAdd = 1) => {
    setCartItems(prev => {
      // Verificar si ya existe este item exacto (misma zapatilla y talla)
      const existingItem = prev.find(item => item.variant.id === variant.id);
      
      if (existingItem) {
        // Incrementar cantidad, sin superar el stock disponible
        return prev.map(item => 
          item.variant.id === variant.id 
            ? { ...item, quantity: Math.min(item.quantity + quantityToAdd, variant.stockQuantity) }
            : item
        );
      }
      
      // Añadir nuevo item
      return [...prev, { sneaker, variant, quantity: Math.min(quantityToAdd, variant.stockQuantity) }];
    });
    // Abrir el carrito automáticamente al añadir
    setIsCartOpen(true);
  };

  const removeFromCart = (variantId) => {
    setCartItems(prev => prev.filter(item => item.variant.id !== variantId));
  };

  const updateQuantity = (variantId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    
    setCartItems(prev => prev.map(item => {
      if (item.variant.id === variantId) {
        // Limitar por el stock real de la base de datos
        return { ...item, quantity: Math.min(newQuantity, item.variant.stockQuantity) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Cálculos derivados
  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((acc, item) => acc + (item.sneaker.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotalItems,
      cartTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};
