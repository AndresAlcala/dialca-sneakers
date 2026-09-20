import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SidebarMenu({ isOpen, onClose }) {
  const navigate = useNavigate();

  // Función auxiliar para navegar a una ruta y cerrar el menú automáticamente
  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Capa oscura semitransparente que cubre el fondo cuando el menú está abierto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity duration-300" 
          onClick={onClose}
        />
      )}

      {/* Contenedor del menú lateral oscuro que se desliza desde la izquierda */}
      <div 
        className={`fixed top-0 left-0 h-full w-[85%] md:w-[400px] bg-[#1a1f24] text-white z-[70] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        {/* Encabezado del menú con el botón para cerrar (X) */}
        <div className="flex justify-end p-6">
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Lista de enlaces principales del menú, con estilo minimalista */}
        <nav className="flex flex-col px-8 py-2 space-y-8 mt-4">
          <button 
            onClick={() => handleNavigation('/nuevo')} 
            className="text-left text-sm font-semibold tracking-wider hover:text-supreme-red transition-colors uppercase"
          >
            NUEVO
          </button>
          
          <button 
            onClick={() => handleNavigation('/hombre')} 
            className="text-left text-sm font-semibold tracking-wider hover:text-supreme-red transition-colors uppercase"
          >
            HOMBRE
          </button>

          <button 
            onClick={() => handleNavigation('/mujer')} 
            className="text-left text-sm font-semibold tracking-wider hover:text-supreme-red transition-colors uppercase"
          >
            MUJER
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
      </div>
    </>
  );
}
