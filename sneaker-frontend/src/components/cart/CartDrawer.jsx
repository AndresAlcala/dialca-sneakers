import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartTotalPrice 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay oscuro de fondo */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cajón lateral derecho */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-neutral-200 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        
        {/* Cabecera del carrito */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-neutral-200 bg-white">
          <div className="flex items-center gap-2 text-black">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-xl font-black uppercase tracking-widest">
              TU CARRITO
            </h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-neutral-400 hover:text-supreme-red hover:bg-neutral-100 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-50">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-sm font-black uppercase tracking-widest text-center">
                El carrito está vacío
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.variant.id} className="flex gap-4 bg-white p-4 border border-neutral-200 shadow-sm relative">
                  
                  {/* Botón eliminar */}
                  <button 
                    onClick={() => removeFromCart(item.variant.id)}
                    className="absolute top-2 right-2 text-neutral-300 hover:text-supreme-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Imagen */}
                  <div className="w-20 h-20 bg-neutral-100 flex-shrink-0">
                    <img 
                      src={item.sneaker.imageUrl} 
                      alt={item.sneaker.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 block mb-1">
                        {item.sneaker.brand}
                      </span>
                      <h3 className="text-sm font-black uppercase tracking-tight leading-none mb-1 pr-6">
                        {item.sneaker.name}
                      </h3>
                      <p className="text-[10px] font-mono text-neutral-600 mb-2">
                        Talla: {item.variant.size} US | {item.variant.color}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm">
                        ${(item.sneaker.price * item.quantity).toFixed(2)}
                      </span>
                      
                      {/* Control de cantidad */}
                      <div className="flex items-center border border-neutral-200">
                        <button 
                          onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-1 text-xs font-mono font-bold w-8 text-center border-x border-neutral-200">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                          disabled={item.quantity >= item.variant.stockQuantity}
                          className="px-2 py-1 hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        <div className="border-t border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-black uppercase tracking-widest text-neutral-500">
              Total Estimado
            </span>
            <span className="text-2xl font-mono font-bold text-black">
              ${cartTotalPrice.toFixed(2)}
            </span>
          </div>
          
          <button 
            disabled={cartItems.length === 0}
            className="w-full bg-street-black text-white hover:bg-supreme-red font-black tracking-widest uppercase py-4 transition-colors disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed"
          >
            PROCEDER AL PAGO
          </button>
          
          <p className="text-center text-[10px] font-mono text-neutral-400 mt-4 uppercase">
            Impuestos y envíos calculados en el checkout.
          </p>
        </div>
      </div>
    </>
  );
}
