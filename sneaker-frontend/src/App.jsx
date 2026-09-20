import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import SneakerGrid from './components/catalog/SneakerGrid';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProductDetailModal from './components/modals/ProductDetailModal';
import AdminModal from './components/modals/AdminModal';
import LoginModal from './components/modals/LoginModal';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import { sneakerApi } from './api/sneakerApi';
import { useSneakers } from './hooks/useSneakers';
import { CartProvider } from './context/CartContext';

import Footer from './components/layout/Footer';

function MainCatalog() {
  const { sneakers, loading, error, refreshSneakers } = useSneakers();
  const [selectedSneaker, setSelectedSneaker] = useState(null);
  
  return (
    <>
      <main className="max-w-7xl mx-auto px-6 py-16 min-h-screen">
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

        {!loading && !error && (
          <SneakerGrid sneakers={sneakers} onSelectSneaker={setSelectedSneaker} />
        )}
      </main>

      {selectedSneaker && (
        <ProductDetailModal sneaker={selectedSneaker} onClose={() => setSelectedSneaker(null)} />
      )}
    </>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const location = useLocation();

  // Ocultamos la barra de navegación y el footer en el checkout para evitar distracciones
  const showNavbar = !location.pathname.startsWith('/checkout');

  return (
    <div className="min-h-screen bg-white text-black selection:bg-supreme-red selection:text-white flex flex-col">
      {showNavbar && (
        <Navbar 
          isAuthenticated={isAuthenticated} 
          onLogout={() => {
            sneakerApi.logout();
            setIsAuthenticated(false);
          }} 
        />
      )}

      {/* Contenedor principal que empuja el footer hacia abajo */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<MainCatalog />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          {/* Rutas para administradores */}
          <Route path="/admin" element={<AdminRoute isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </div>

      {/* Renderizamos el Footer solo donde se muestra el Navbar */}
      {showNavbar && <Footer />}
    </div>
  );
}

// Subcomponente para manejar la vista de Admin (simulando que está montada sobre la principal o como página independiente)
function AdminRoute({ isAuthenticated, setIsAuthenticated }) {
  const { sneakers, refreshSneakers } = useSneakers();
  
  if (!isAuthenticated) {
    return (
      <LoginModal 
        onClose={() => window.location.href = '/'} 
        onLoginSuccess={(token) => {
          sneakerApi.setToken(token);
          setIsAuthenticated(true);
        }} 
      />
    );
  }

  return (
    <AdminModal 
      onClose={() => window.location.href = '/'} 
      sneakers={sneakers} 
      refreshCatalog={refreshSneakers} 
    />
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
}