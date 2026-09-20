import React from 'react';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#1a1f24] text-white pt-16 pb-8 border-t-[6px] border-supreme-red">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Información de la marca */}
        <div className="space-y-4">
          <h3 className="text-xl font-black tracking-widest uppercase mb-6">Dialca Sneakers</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Tu destino definitivo para el mejor calzado urbano y deportivo. Ediciones limitadas, calidad premium y estilo inigualable.
          </p>
          <div className="flex gap-4 pt-4 text-xs font-bold tracking-widest">
            <a href="#" className="text-neutral-400 hover:text-supreme-red transition-colors" aria-label="Instagram">INSTAGRAM</a>
            <a href="#" className="text-neutral-400 hover:text-supreme-red transition-colors" aria-label="Twitter">TWITTER</a>
            <a href="#" className="text-neutral-400 hover:text-supreme-red transition-colors" aria-label="Facebook">FACEBOOK</a>
          </div>
        </div>

        {/* Enlaces Rápidos */}
        <div>
          <h4 className="text-sm font-black tracking-widest uppercase mb-6 text-neutral-300">Explorar</h4>
          <ul className="space-y-3">
            <li><button onClick={() => navigate('/nuevo')} className="text-sm text-neutral-400 hover:text-white transition-colors">Nuevo</button></li>
            <li><button onClick={() => navigate('/hombre')} className="text-sm text-neutral-400 hover:text-white transition-colors">Hombre</button></li>
            <li><button onClick={() => navigate('/mujer')} className="text-sm text-neutral-400 hover:text-white transition-colors">Mujer</button></li>
            <li><button onClick={() => navigate('/running')} className="text-sm text-neutral-400 hover:text-white transition-colors">Running</button></li>
          </ul>
        </div>

        {/* Soporte y Políticas */}
        <div>
          <h4 className="text-sm font-black tracking-widest uppercase mb-6 text-neutral-300">Soporte</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Preguntas Frecuentes</a></li>
            <li><a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Políticas de Envío</a></li>
            <li><a href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Devoluciones</a></li>
            <li><button onClick={() => navigate('/terminos')} className="text-sm text-neutral-400 hover:text-white transition-colors">Términos y Condiciones</button></li>
          </ul>
        </div>

        {/* Boletín Informativo (Newsletter) */}
        <div>
          <h4 className="text-sm font-black tracking-widest uppercase mb-6 text-neutral-300">Boletín</h4>
          <p className="text-sm text-neutral-400 mb-4">Suscríbete para recibir noticias de los últimos drops y ofertas exclusivas.</p>
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                required
                className="w-full bg-black border border-neutral-700 text-sm text-white py-2 pl-9 pr-4 outline-none focus:border-supreme-red transition-colors"
              />
            </div>
            <button 
              type="submit" 
              className="bg-supreme-red text-white text-xs font-bold tracking-widest uppercase py-3 hover:bg-white hover:text-black transition-colors"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </div>

      {/* Copyright e Iconos de pago */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-neutral-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-neutral-500">
          &copy; 2026 DIALCA SNEAKERS. Todos los derechos reservados.
        </p>
        <div className="flex gap-4">
          <div className="text-[10px] font-bold text-neutral-500 border border-neutral-700 px-2 py-1 rounded">VISA</div>
          <div className="text-[10px] font-bold text-neutral-500 border border-neutral-700 px-2 py-1 rounded">MASTERCARD</div>
          <div className="text-[10px] font-bold text-neutral-500 border border-neutral-700 px-2 py-1 rounded">AMEX</div>
        </div>
      </div>
    </footer>
  );
}
