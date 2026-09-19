import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import SneakerGrid from './components/catalog/SneakerGrid';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProductDetailModal from './components/modals/ProductDetailModal';
import AdminModal from './components/modals/AdminModal';
import LoginModal from './components/modals/LoginModal';
import CartDrawer from './components/cart/CartDrawer';
import { sneakerApi } from './api/sneakerApi';
import { useSneakers } from './hooks/useSneakers';
import { CartProvider } from './context/CartContext';

export default function App() {
  const { sneakers, loading, error, refreshSneakers } = useSneakers();
  const [selectedSneaker, setSelectedSneaker] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  const handleOpenAdmin = () => {
    if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLoginSuccess = (token, role) => {
    sneakerApi.setToken(token);
    setIsAuthenticated(true);
    setIsLoginOpen(false);
    if (role === 'ADMIN') {
      setIsAdminOpen(true);
    }
  };

  const handleSelectSneaker = (sneaker) => {
    setSelectedSneaker(sneaker);
  };

  const closeModal = () => {
    setSelectedSneaker(null);
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white text-black selection:bg-supreme-red selection:text-white">
      {/* Navbar Minimalista / Urban Streetwear */}
      <Navbar onOpenAdmin={handleOpenAdmin} isAuthenticated={isAuthenticated} onLogout={() => {
        sneakerApi.logout();
        setIsAuthenticated(false);
        setIsAdminOpen(false);
      }} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12 border-b border-neutral-200 pb-6 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 block mb-1">
              OFFICIAL CATALOG • SYNCED
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
              FOOTWEAR COLLECTION
            </h1>
          </div>
          <span className="text-xs font-mono text-neutral-500">
            {sneakers.length} MODELS
          </span>
        </div>

        {loading && <LoadingSpinner />}

        {error && (
          <div className="border border-red-200 bg-red-50 p-4 text-xs font-mono text-red-600 mb-8">
            ERROR DE CONEXIÓN: {error}. ¿Está Spring Boot corriendo en el puerto 8080?
          </div>
        )}

        {/* Grid de Productos */}
        {!loading && !error && (
          <SneakerGrid sneakers={sneakers} onSelectSneaker={handleSelectSneaker} />
        )}
      </main>

      {/* Modal / Vista de Detalle y Tallas */}
      {selectedSneaker && (
        <ProductDetailModal sneaker={selectedSneaker} onClose={closeModal} />
      )}

      {/* Modal de Login */}
      {isLoginOpen && (
        <LoginModal 
          onClose={() => setIsLoginOpen(false)} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}

      {/* Modal de Administrador */}
      {isAdminOpen && isAuthenticated && (
        <AdminModal 
          onClose={() => setIsAdminOpen(false)} 
          sneakers={sneakers} 
          refreshCatalog={refreshSneakers} 
        />
      )}
      
      {/* Cajón del Carrito */}
      <CartDrawer />
    </div>
    </CartProvider>
  );
}