import React, { useState } from 'react';
import { X, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SidebarMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  // Estado para saber qué menú estamos viendo ('main', 'hombre', o 'mujer')
  const [activeSubmenu, setActiveSubmenu] = useState('main');

  // Función para cerrar el menú de manera segura y restablecer al menú principal
  const handleClose = () => {
    onClose();
    // Restablecemos el menú principal luego de un pequeño retraso para que no se vea el cambio brusco durante la animación de cierre
    setTimeout(() => setActiveSubmenu('main'), 300); 
  };

  // Función auxiliar para navegar a una ruta (ej. /hombre/nike) y cerrar el menú automáticamente
  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  // Lista de marcas en el orden solicitado (sin LUXURY)
  const brands = [
    'NIKE',
    'ADIDAS',
    'JORDAN',
    'PUMA',
    'NEW BALANCE',
    'REEBOK',
    'FILA',
    'OTRAS'
  ];

  return (
    <>
      {/* Capa oscura semitransparente que cubre el fondo cuando el menú está abierto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity duration-300" 
          onClick={handleClose}
        />
      )}

      {/* Contenedor del menú lateral oscuro que se desliza desde la izquierda */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85%] md:w-[400px] bg-[#1a1f24] text-white z-[70] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-hidden flex flex-col`}
      >
        {/* Encabezado fijo del menú con el botón para cerrar la barra (X) */}
        <div className="flex justify-end p-6 flex-shrink-0">
          <button 
            onClick={handleClose}
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Contenedor relativo que nos permite cambiar el contenido entre el menú principal y los submenús */}
        <div className="flex-1 overflow-y-auto w-full relative">
          
          {/* ===================== MENÚ PRINCIPAL ===================== */}
          {activeSubmenu === 'main' && (
            <nav className="flex flex-col px-8 py-2 space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              <button 
                onClick={() => handleNavigation('/nuevo')} 
                className="text-left text-sm font-semibold tracking-wider hover:text-supreme-red transition-colors uppercase"
              >
                NUEVO
              </button>
              
              {/* Botón que cambia el estado para abrir el submenú de Hombre */}
              <button 
                onClick={() => setActiveSubmenu('hombre')} 
                className="text-left text-sm font-semibold tracking-wider hover:text-supreme-red transition-colors uppercase flex items-center justify-between group"
              >
                HOMBRE
                <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-supreme-red transition-colors" />
              </button>

              {/* Botón que cambia el estado para abrir el submenú de Mujer */}
              <button 
                onClick={() => setActiveSubmenu('mujer')} 
                className="text-left text-sm font-semibold tracking-wider hover:text-supreme-red transition-colors uppercase flex items-center justify-between group"
              >
                MUJER
                <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-supreme-red transition-colors" />
              </button>

              <button 
                onClick={() => handleNavigation('/terminos')} 
                className="text-left text-sm font-semibold tracking-wider hover:text-supreme-red transition-colors uppercase"
              >
                TÉRMINOS Y CONDICIONES
              </button>

              <button 
                onClick={() => handleNavigation('/running')} 
                className="text-left text-sm font-semibold tracking-wider hover:text-supreme-red transition-colors uppercase"
              >
                RUNNING
              </button>
            </nav>
          )}

          {/* ===================== SUBMENÚ DE MARCAS (Hombre o Mujer) ===================== */}
          {(activeSubmenu === 'hombre' || activeSubmenu === 'mujer') && (
            <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 h-full">
              
              {/* Botón superior (Cabecera) para regresar al menú principal */}
              <button 
                onClick={() => setActiveSubmenu('main')}
                className="flex items-center gap-3 px-8 py-4 bg-[#23292f] border-b border-[#2d333b] hover:bg-[#2d333b] transition-colors w-full text-left"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-300" />
                <span className="text-sm font-bold tracking-wider uppercase text-white">
                  {activeSubmenu === 'hombre' ? 'HOMBRE' : 'MUJER'}
                </span>
              </button>

              {/* Mapeo automático de la lista de marcas para renderizar cada botón de navegación */}
              <nav className="flex flex-col px-8 py-6 space-y-8">
                {brands.map((brand) => (
                  <button 
                    key={brand}
                    onClick={() => handleNavigation(`/${activeSubmenu}/${brand.toLowerCase().replace(' ', '-')}`)} 
                    className="text-left text-sm font-semibold tracking-wider hover:text-supreme-red transition-colors uppercase"
                  >
                    {brand}
                  </button>
                ))}
              </nav>

            </div>
          )}

        </div>
      </div>
    </>
  );
}
