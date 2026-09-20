import React from 'react';

/**
 * Componente HeroBanner
 * Muestra una sección gigante de bienvenida con una imagen de fondo y la frase principal de la tienda.
 */
export default function HeroBanner() {
  // Función para hacer scroll suave hasta el catálogo de productos
  const scrollToCatalog = () => {
    const catalogSection = document.getElementById('catalogo-productos');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-[60vh] min-h-[400px] flex items-center bg-neutral-900 overflow-hidden">
      {/* Imagen de fondo. Se asume que el usuario subió /hero-bg.jpg a public/ */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />

      {/* Capa de oscurecimiento (overlay) para que el texto blanco resalte siempre */}
      <div className="absolute inset-0 z-10 bg-black/40" />

      {/* Contenedor del contenido (Texto y Botón) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-2xl text-white">
          {/* Subtítulo pequeño superior */}
          <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase block mb-4 text-neutral-300">
            BIENVENIDO A DIALCA SNEAKERS
          </span>

          {/* Título principal escogido por el usuario */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-8 drop-shadow-lg">
            EXCLUSIVIDAD <br className="hidden md:block" />
            A CADA PASO
          </h1>

          {/* Botón de acción minimalista transparente con borde */}
          <button 
            onClick={scrollToCatalog}
            className="border-2 border-white px-8 py-3 text-xs font-black tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
          >
            VER PRODUCTOS
          </button>
        </div>
      </div>
    </div>
  );
}
