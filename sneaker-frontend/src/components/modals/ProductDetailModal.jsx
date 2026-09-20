import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { sneakerApi } from '../../api/sneakerApi';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function ProductDetailModal({ sneaker, onClose }) {
  const [variants, setVariants] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  
  // Estado para rastrear las cantidades seleccionadas de cada variante { [variantId]: cantidad }
  const [variantQuantities, setVariantQuantities] = useState({});
  
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sneaker) return;
    
    let isMounted = true;
    setLoadingVariants(true);
    
    sneakerApi.getVariants(sneaker.id)
      .then((data) => {
        if (isMounted) {
          setVariants(data);
          setLoadingVariants(false);
          // Inicializamos las cantidades en 0
          const initialQuantities = {};
          data.forEach(v => {
            initialQuantities[v.id] = 0;
          });
          setVariantQuantities(initialQuantities);
        }
      })
      .catch(() => {
        if (isMounted) {
          setVariants([]);
          setLoadingVariants(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [sneaker]);

  // Manejar el cambio de cantidad para una fila específica
  const updateQuantity = (variantId, delta, stockQuantity) => {
    setVariantQuantities(prev => {
      const current = prev[variantId] || 0;
      const next = Math.max(0, Math.min(current + delta, stockQuantity));
      return { ...prev, [variantId]: next };
    });
  };

  // Calcular totales
  const totalItems = Object.values(variantQuantities).reduce((a, b) => a + b, 0);
  const totalPrice = totalItems * Number(sneaker?.price || 0);

  // Guardar en el carrito y cerrar
  const handleAddToCart = () => {
    Object.entries(variantQuantities).forEach(([variantId, qty]) => {
      if (qty > 0) {
        const variant = variants.find(v => v.id.toString() === variantId);
        if (variant) {
          addToCart(sneaker, variant, qty);
        }
      }
    });
    
    onClose();
    navigate('/cart');
  };

  if (!sneaker) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
      {/* Contenedor principal del modal (diseño ancho tipo Quick Shop) */}
      <div className="bg-[#f9f9f9] w-full max-w-6xl h-full max-h-[90vh] flex flex-col md:flex-row relative rounded-md shadow-2xl overflow-hidden">
        
        {/* Botón de cierre global */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full z-10 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-neutral-600" />
        </button>

        {/* Columna Izquierda: Imagen y Detalles Básicos */}
        <div className="w-full md:w-[35%] bg-white p-6 md:p-10 flex flex-col border-r border-neutral-200 overflow-y-auto">
          <div className="aspect-square bg-neutral-100 rounded-md overflow-hidden mb-6 border border-neutral-200">
            {sneaker.imageUrl ? (
              <img
                src={sneaker.imageUrl}
                alt={sneaker.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                Sin Imagen
              </div>
            )}
          </div>
          
          <button className="text-xs text-neutral-500 hover:text-black transition-colors flex items-center gap-1">
            Ver todos los detalles <span aria-hidden="true">&rarr;</span>
          </button>
        </div>

        {/* Columna Derecha: Título, Tabla de Tallas y Totales */}
        <div className="w-full md:w-[65%] flex flex-col p-6 md:p-10 overflow-hidden">
          
          {/* Cabecera del Producto */}
          <div className="mb-8 flex-shrink-0">
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-2 tracking-tight">
              {sneaker.name}
            </h2>
            <p className="text-sm font-mono text-neutral-600">
              ${Number(sneaker.price).toLocaleString('es-CO', { minimumFractionDigits: 2 })} COP
            </p>
          </div>

          {/* Encabezado de la Tabla */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-neutral-200 text-[9px] font-bold text-neutral-400 tracking-widest uppercase flex-shrink-0">
            <div className="col-span-5">Variante</div>
            <div className="col-span-3 text-center">Cantidad</div>
            <div className="col-span-2 text-right">Precio</div>
            <div className="col-span-2 text-right">Total de Variantes</div>
          </div>

          {/* Cuerpo de la Tabla (Scrollable) */}
          <div className="flex-1 overflow-y-auto py-2 space-y-4 md:space-y-0 min-h-[200px]">
            {loadingVariants ? (
              <div className="text-sm font-mono text-neutral-400 py-8 text-center">Cargando variantes...</div>
            ) : variants.length === 0 ? (
              <div className="text-sm font-mono text-neutral-400 py-8 text-center">No hay stock disponible.</div>
            ) : (
              variants.map((v) => {
                const qty = variantQuantities[v.id] || 0;
                const lineTotal = qty * Number(sneaker.price);
                const isOutOfStock = v.stockQuantity <= 0;

                return (
                  <div 
                    key={v.id} 
                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 border-b border-neutral-100 md:border-none ${isOutOfStock ? 'opacity-50' : ''}`}
                  >
                    {/* Variante */}
                    <div className="col-span-1 md:col-span-5 text-xs font-bold text-neutral-700">
                      {v.size} {isOutOfStock && '(Agotado)'}
                    </div>

                    {/* Selector de Cantidad */}
                    <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center">
                      <div className="flex items-center border border-neutral-300 rounded-sm bg-white overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(v.id, -1, v.stockQuantity)}
                          disabled={qty <= 0 || isOutOfStock}
                          className="px-3 py-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-mono">
                          {qty}
                        </span>
                        <button 
                          onClick={() => updateQuantity(v.id, 1, v.stockQuantity)}
                          disabled={qty >= v.stockQuantity || isOutOfStock}
                          className="px-3 py-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Precio Unitario */}
                    <div className="col-span-1 md:col-span-2 text-left md:text-right text-[11px] font-mono text-neutral-500">
                      ${Number(sneaker.price).toLocaleString('es-CO', { minimumFractionDigits: 2 })}/unidad
                    </div>

                    {/* Total de Variante */}
                    <div className="col-span-1 md:col-span-2 text-left md:text-right text-xs font-mono font-bold text-neutral-900">
                      ${lineTotal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer del Modal (Totales y Botón de Añadir) */}
          <div className="mt-6 pt-6 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0 bg-[#f9f9f9]">
            
            {/* Botón de Añadir al carrito */}
            <button
              disabled={totalItems === 0}
              onClick={handleAddToCart}
              className="w-full md:w-auto px-8 py-3 bg-white border-2 border-black text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              AÑADIR AL CARRITO
            </button>
            
            <div className="flex w-full md:w-auto justify-between md:justify-end gap-12 items-center">
              {/* Total de artículos */}
              <div className="text-center">
                <span className="block text-lg font-mono font-black">{totalItems}</span>
                <span className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase">
                  Total de artículos
                </span>
              </div>
              
              {/* Subtotal */}
              <div className="text-right">
                <span className="block text-lg font-mono font-black">
                  ${totalPrice.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] font-bold text-neutral-500 tracking-wider uppercase block mb-1">
                  Subtotal de productos
                </span>
                <span className="text-[8px] text-neutral-400 block max-w-[150px] leading-tight">
                  Impuestos, descuentos y envío calculados en la pantalla de pago
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
