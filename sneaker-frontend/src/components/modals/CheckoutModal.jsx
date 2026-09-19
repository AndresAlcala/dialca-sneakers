import React, { useState } from 'react';
import { X, CreditCard, CheckCircle, Truck } from 'lucide-react';
import { sneakerApi } from '../../api/sneakerApi';
import { useCart } from '../../context/CartContext';

export default function CheckoutModal({ isOpen, onClose }) {
  const { cartItems, cartTotalPrice, clearCart, setIsCartOpen } = useCart();
  
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Preparar el objeto de la orden que espera el backend
    const orderData = {
      items: cartItems.map(item => ({
        variantId: item.variant.id,
        quantity: item.quantity
      })),
      shippingAddress: `${shippingAddress}, ${city}`,
      email: email // Añadido para el Guest Checkout
    };

    try {
      await sneakerApi.createOrder(orderData);
      // Si la orden se procesa con éxito, limpiamos carrito y mostramos éxito
      clearCart();
      setIsSuccess(true);
      // El carrito ya no debe mostrarse si estábamos en el modal
      setIsCartOpen(false);
    } catch (err) {
      setError(err.message || 'Hubo un error al procesar el pago.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Si fue exitoso y cerramos, reseteamos el estado interno
    if (isSuccess) {
      setIsSuccess(false);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto py-10">
      <div className="bg-street-black text-white border-2 border-white w-full max-w-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-white hover:text-black transition-colors"
          aria-label="Cerrar Checkout"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center text-green-500 bg-green-500/10">
                  <CheckCircle className="w-10 h-10" />
                </div>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-4">
                ¡Pago Exitoso!
              </h2>
              <p className="text-sm font-mono text-neutral-400 mb-8">
                Tu orden ha sido confirmada y está siendo procesada. Te enviaremos un correo con los detalles del envío pronto.
              </p>
              <button
                onClick={handleClose}
                className="w-full bg-white text-black hover:bg-neutral-200 font-black tracking-widest py-4 uppercase text-sm"
              >
                Volver a la tienda
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-8">
                <CreditCard className="w-6 h-6 text-supreme-red" />
                <h2 className="text-xl font-black uppercase tracking-widest">
                  Checkout
                </h2>
              </div>

              {error && (
                <div className="bg-supreme-red text-white p-3 text-xs font-mono mb-6 text-center border border-white">
                  {error}
                </div>
              )}

              <div className="mb-6 bg-neutral-900 p-4 border border-neutral-800">
                <h3 className="text-[10px] font-black tracking-widest text-neutral-500 uppercase mb-3">
                  Resumen de Compra
                </h3>
                <div className="flex justify-between items-center text-lg font-mono">
                  <span>Total a Pagar:</span>
                  <span className="font-bold text-green-400">${cartTotalPrice.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black tracking-widest text-neutral-500 uppercase flex items-center gap-2">
                    <Truck className="w-3 h-3" /> Datos de Envío
                  </h3>
                  
                  <div>
                    <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">
                      Correo Electrónico
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">
                      Dirección Completa
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Calle 123, Depto 4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">
                      Ciudad
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ciudad Gotica"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <p className="text-[10px] font-mono text-neutral-500 mb-4 text-center">
                    * Al hacer clic en confirmar, se realizará un cargo automático por el total de la orden.
                  </p>
                  <button
                    type="submit"
                    disabled={isLoading || cartItems.length === 0}
                    className="w-full bg-supreme-red text-white hover:bg-red-700 font-black tracking-widest py-4 transition-colors uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-white"
                  >
                    {isLoading ? 'Procesando Pago...' : 'Confirmar y Pagar'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
