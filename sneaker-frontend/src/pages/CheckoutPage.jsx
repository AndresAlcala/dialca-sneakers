import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { sneakerApi } from '../api/sneakerApi';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react'; // Simulating secure icons

export default function CheckoutPage() {
  const { cartItems, cartTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirigir si el carrito está vacío
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 bg-white min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">No hay nada que pagar</h2>
        <Link to="/" className="text-supreme-red underline">Volver a la tienda</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const orderData = {
      items: cartItems.map(item => ({
        variantId: item.variant.id,
        quantity: item.quantity
      })),
      shippingAddress: `${address} ${apartment}, ${city}, ${postalCode}`,
      email: email
    };

    try {
      await sneakerApi.createOrder(orderData);
      clearCart();
      navigate('/checkout/success');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-neutral-50 flex flex-col md:flex-row">
      
      {/* Columna Izquierda: Formulario (Contacto, Envío, Pago) */}
      <div className="w-full md:w-[55%] lg:w-[60%] bg-white p-6 md:p-12 lg:px-24">
        <div className="max-w-xl mx-auto md:ml-auto md:mr-10">
          <Link to="/" className="text-2xl font-black tracking-tighter uppercase block mb-8">
            FEIDCLOTHES
          </Link>

          <form onSubmit={handleSubmit} className="space-y-10">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 text-sm">
                {error}
              </div>
            )}

            {/* Contacto */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Contacto</h2>
                <span className="text-sm text-neutral-600 underline cursor-pointer">Iniciar sesión</span>
              </div>
              <input
                required
                type="email"
                placeholder="Correo electrónico"
                className="w-full border border-neutral-300 rounded p-3 text-sm focus:ring-1 focus:ring-black outline-none transition-shadow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="mt-3 flex items-center gap-2">
                <input type="checkbox" id="news" className="w-4 h-4 text-black focus:ring-black rounded border-neutral-300" defaultChecked />
                <label htmlFor="news" className="text-sm text-neutral-600">Enviarme novedades y ofertas por correo electrónico</label>
              </div>
            </section>

            {/* Entrega */}
            <section>
              <h2 className="text-lg font-medium mb-4">Entrega</h2>
              
              <div className="border border-neutral-300 rounded bg-white overflow-hidden mb-4">
                <div className="p-3 text-sm border-b border-neutral-300 text-neutral-500">
                  <span className="block text-xs mb-1">País / Región</span>
                  <span className="text-black font-medium">Colombia</span>
                </div>
                <div className="flex border-b border-neutral-300">
                  <input required type="text" placeholder="Nombre" className="w-1/2 p-3 text-sm border-r border-neutral-300 outline-none" value={firstName} onChange={e => setFirstName(e.target.value)} />
                  <input required type="text" placeholder="Apellidos" className="w-1/2 p-3 text-sm outline-none" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
                <input required type="text" placeholder="Dirección" className="w-full p-3 text-sm border-b border-neutral-300 outline-none" value={address} onChange={e => setAddress(e.target.value)} />
                <input type="text" placeholder="Casa, apartamento, etc. (opcional)" className="w-full p-3 text-sm border-b border-neutral-300 outline-none" value={apartment} onChange={e => setApartment(e.target.value)} />
                <div className="flex">
                  <input required type="text" placeholder="Ciudad" className="w-1/2 p-3 text-sm border-r border-neutral-300 outline-none" value={city} onChange={e => setCity(e.target.value)} />
                  <input required type="text" placeholder="Código postal" className="w-1/2 p-3 text-sm outline-none" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                </div>
              </div>
            </section>

            {/* Métodos de envío */}
            <section>
              <h2 className="text-lg font-medium mb-4">Métodos de envío</h2>
              <div className="border border-[#1773B0] bg-[#F4F8FB] rounded p-4 flex justify-between items-center cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="radio" checked readOnly className="w-4 h-4 text-[#1773B0]" />
                  <span className="text-sm font-medium">Envío con transportadora</span>
                </div>
                <span className="text-sm font-bold">GRATIS</span>
              </div>
            </section>

            {/* Pago */}
            <section>
              <h2 className="text-lg font-medium mb-1">Pago</h2>
              <p className="text-xs text-neutral-500 mb-4">Todas las transacciones son seguras y están encriptadas.</p>
              
              <div className="border-x border-t border-[#0058e6] bg-[#f4f8fe] rounded-t p-4 flex justify-between items-center relative">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-4 border-[#0058e6] flex items-center justify-center bg-white flex-shrink-0"></div>
                  <span className="text-sm font-medium">Tarjeta de crédito o débito</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-8 h-5 bg-[#142994] rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
                  <div className="w-8 h-5 bg-[#111112] rounded flex items-center justify-center relative overflow-hidden">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] absolute left-1 mix-blend-screen"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] absolute right-1 mix-blend-screen"></div>
                  </div>
                  <div className="w-8 h-5 bg-[#2671B9] rounded text-white text-[7px] flex items-center justify-center font-bold px-1 text-center leading-none">AMEX</div>
                </div>
              </div>
              
              <div className="border border-neutral-300 bg-[#f4f8fe] p-4 space-y-3">
                <div className="relative">
                  <input type="text" placeholder="Número de tarjeta" className="w-full p-3 text-sm border border-neutral-300 rounded outline-none bg-white" />
                  <Lock className="w-4 h-4 absolute right-3 top-3.5 text-neutral-400" />
                </div>
                <div className="flex gap-3">
                  <input type="text" placeholder="Fecha de vencimiento (MM / AA)" className="w-1/2 p-3 text-sm border border-neutral-300 rounded outline-none bg-white" />
                  <div className="relative w-1/2">
                    <input type="text" placeholder="Código de seguridad" className="w-full p-3 text-sm border border-neutral-300 rounded outline-none bg-white" />
                    <div className="absolute right-3 top-3.5 w-4 h-4 border border-neutral-400 text-neutral-400 rounded-full flex items-center justify-center text-[9px] font-bold">?</div>
                  </div>
                </div>
                <input type="text" placeholder="Nombre del titular" className="w-full p-3 text-sm border border-neutral-300 rounded outline-none bg-white" />
                <input type="text" placeholder="CC" className="w-full p-3 text-sm border border-neutral-300 rounded outline-none bg-white" />
                <div className="relative">
                  <select className="w-full p-3 text-sm border border-neutral-300 rounded outline-none bg-white appearance-none text-neutral-500">
                    <option>Plan de pago</option>
                  </select>
                  <svg className="w-3 h-3 absolute right-4 top-4.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              
              <div className="border-x border-b border-neutral-300 bg-white p-4 rounded-b border-t border-t-neutral-300">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="billing" className="w-4 h-4 text-[#0058e6] rounded bg-[#0058e6]" defaultChecked />
                  <label htmlFor="billing" className="text-sm">Usar la dirección de envío como dirección de facturación</label>
                </div>
              </div>

              {/* Otros métodos de pago */}
              <div className="border border-neutral-300 rounded mt-4 overflow-hidden bg-white">
                <div className="border-b border-neutral-300 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-neutral-300 flex-shrink-0"></div>
                    <span className="text-sm">Paga a Crédito o Débito con PSE</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-[9px] font-bold text-blue-600 border border-neutral-200 px-1 rounded flex items-center">Addi</span>
                    <span className="text-[9px] font-bold text-gray-500 border border-neutral-200 px-1 rounded flex items-center">PSE</span>
                  </div>
                </div>
                
                <div className="border-b border-neutral-300 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-neutral-300 flex-shrink-0"></div>
                    <span className="text-sm">Wompi</span>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-8 h-5 bg-[#142994] rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
                    <div className="w-8 h-5 bg-[#111112] rounded flex items-center justify-center relative overflow-hidden">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] absolute left-1 mix-blend-screen"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] absolute right-1 mix-blend-screen"></div>
                    </div>
                    <div className="w-8 h-5 bg-[#2671B9] rounded text-white text-[7px] flex items-center justify-center font-bold px-1 text-center leading-none">AMEX</div>
                    <div className="w-6 h-5 border border-neutral-200 rounded text-blue-500 text-[9px] flex items-center justify-center font-bold">+4</div>
                  </div>
                </div>

                <div className="border-b border-neutral-300 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-neutral-300 flex-shrink-0"></div>
                    <span className="text-sm">Pago contra entrega</span>
                  </div>
                </div>

                <div className="border-b border-neutral-300 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-neutral-300 flex-shrink-0"></div>
                    <span className="text-sm">Depósito Bancario</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-neutral-300 flex-shrink-0"></div>
                    <span className="text-sm">Retiro en tienda</span>
                  </div>
                </div>
              </div>

            </section>

            {/* Submit */}
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 text-white text-base font-bold rounded-md transition-colors ${isLoading ? 'bg-neutral-500' : 'bg-[#0058e6] hover:bg-[#0047b8]'}`}
            >
              {isLoading ? 'PROCESANDO...' : 'Pagar ahora'}
            </button>
            
            <div className="border-t border-neutral-200 pt-4 mt-6">
              <p className="text-[10px] text-neutral-500">Todos los derechos reservados FEIDCLOTHES</p>
            </div>
          </form>
        </div>
      </div>

      {/* Columna Derecha: Resumen de Orden */}
      <div className="w-full md:w-[45%] lg:w-[40%] bg-neutral-50 border-l border-neutral-200 p-6 md:p-12 lg:px-16 hidden md:block">
        <div className="max-w-md sticky top-12">
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.variant.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 bg-white border border-neutral-200 rounded flex-shrink-0">
                  <img 
                    src={item.sneaker.imageUrl} 
                    alt={item.sneaker.name} 
                    className="w-full h-full object-cover rounded p-1"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80'; }}
                  />
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-neutral-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold z-10">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-neutral-900">{item.sneaker.name}</h4>
                  <p className="text-xs text-neutral-500">{item.variant.size} / {item.variant.color}</p>
                </div>
                <div className="text-sm font-medium text-neutral-900">
                  ${(item.sneaker.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-6 border-y border-neutral-200 py-6">
            <input type="text" placeholder="Tarjeta de regalo" className="flex-1 border border-neutral-300 rounded p-3 text-sm outline-none" />
            <button className="bg-neutral-200 text-neutral-400 font-medium px-4 rounded text-sm cursor-not-allowed">
              Aplicar
            </button>
          </div>

          <div className="space-y-3 text-sm text-neutral-600 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-neutral-900">${cartTotalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>GRATIS</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-lg font-medium text-neutral-900">
            <span>Total</span>
            <span className="flex items-center gap-2"><span className="text-xs text-neutral-500 font-normal">COP</span> ${cartTotalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
