import React, { useState } from 'react';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';

export default function Navbar({ isAuthenticated, onLogout }) {
  const { cartTotalItems } = useCart();
  const navigate = useNavigate();
  // Estado para controlar si el menú lateral (Sidebar) está abierto o cerrado
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Botón de Menú Hamburguesa (visible en todas las pantallas ahora) */}
            <button 
              className="p-2 -ml-2 hover:text-supreme-red transition-colors" 
              aria-label="Menú"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-[0.2em]">
              <a href="#drops" className="hover:text-supreme-red transition-colors">DROPS</a>
              <a href="#catalog" className="hover:text-supreme-red transition-colors">CALZADO</a>
              <a href="#about" className="hover:text-supreme-red transition-colors">INFO</a>
            </nav>
          </div>

          {/* Logo de la marca */}
          <div className="flex items-center">
            <img
              src="/dialca-logo.png"
              alt="DIALCA SNEAKERS"
              className="h-10 md:h-12 w-auto object-contain cursor-pointer"
              onClick={() => navigate('/')}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-lg md:text-xl font-black tracking-[0.2em] uppercase cursor-pointer" onclick="window.location.href=\'/\'">DIALCA SNEAKERS</span>';
              }}
            />
          </div>

          <div className="flex items-center gap-5">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => navigate('/admin')}
                  className="text-[10px] font-black tracking-widest text-supreme-red hover:text-black transition-colors"
                >
                  PANEL ADMIN
                </button>
                <button
                  onClick={onLogout}
                  className="text-[10px] font-black tracking-widest text-neutral-400 hover:text-supreme-red transition-colors"
                >
                  SALIR
                </button>
              </>
            )}
            <button aria-label="Buscar" className="hover:text-supreme-red transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button 
              aria-label="Carrito" 
              onClick={() => navigate('/cart')}
              className="hover:text-supreme-red transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-bold bg-black text-white w-4 h-4 rounded-full flex items-center justify-center">
                {cartTotalItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Renderizamos el menú lateral pasándole los props de estado */}
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
