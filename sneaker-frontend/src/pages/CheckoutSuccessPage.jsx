import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">¡Pedido Confirmado!</h1>
      <p className="text-neutral-600 mb-8 max-w-md">
        Gracias por tu compra. Hemos recibido tu pedido y te enviaremos una confirmación por correo electrónico en breve.
      </p>
      <Link 
        to="/" 
        className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-neutral-800 transition-colors rounded"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
