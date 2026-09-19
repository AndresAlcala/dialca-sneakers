import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-[60vh]">
      <div className="flex justify-between items-end mb-10">
        <h1 className="text-4xl font-normal tracking-tight text-neutral-900">Tu carrito</h1>
        <Link to="/" className="text-sm underline underline-offset-4 text-neutral-600 hover:text-black">
          Seguir comprando
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-500 mb-6">Tu carrito está vacío.</p>
          <Link to="/" className="bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-800 transition-colors">
            Ver colección
          </Link>
        </div>
      ) : (
        <>
          <div className="hidden md:grid grid-cols-12 text-[10px] tracking-widest text-neutral-400 uppercase border-b border-neutral-200 pb-3 mb-6">
            <div className="col-span-7">Producto</div>
            <div className="col-span-3 text-center">Cantidad</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="space-y-8">
            {cartItems.map((item) => (
              <div key={item.variant.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-neutral-100 pb-8">
                {/* Producto */}
                <div className="col-span-1 md:col-span-7 flex gap-6">
                  <div className="w-24 h-24 bg-neutral-100 flex-shrink-0">
                    <img 
                      src={item.sneaker.imageUrl} 
                      alt={item.sneaker.name} 
                      className="w-full h-full object-cover mix-blend-multiply"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-sm font-medium text-neutral-900">{item.sneaker.name}</h3>
                    <p className="text-sm text-neutral-500 mt-1">${item.sneaker.price.toFixed(2)}</p>
                    <p className="text-xs text-neutral-500 mt-2">
                      Talla del calzado: {item.variant.size}
                    </p>
                    <p className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 rounded-full bg-black inline-block"></span> {item.variant.color}
                    </p>
                  </div>
                </div>

                {/* Cantidad */}
                <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center items-center gap-4">
                  <div className="flex items-center border border-neutral-300">
                    <button 
                      onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                      className="px-4 py-2 text-neutral-500 hover:text-black transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                      className="px-4 py-2 text-neutral-500 hover:text-black transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.variant.id)}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Total */}
                <div className="col-span-1 md:col-span-2 text-left md:text-right">
                  <p className="text-sm font-medium text-neutral-900">
                    ${(item.sneaker.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-end">
            <div className="w-full md:w-1/3 flex flex-col items-end">
              <div className="flex justify-between w-full text-base mb-2">
                <span className="text-neutral-600">Total estimado</span>
                <span className="font-medium text-neutral-900">${cartTotalPrice.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-neutral-500 text-right mb-6">
                Impuestos, descuentos y envío calculados en la pantalla de pago
              </p>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#2A3342] text-white py-4 text-sm font-medium hover:bg-black transition-colors"
              >
                Pagar pedido
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
