import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { sneakerApi } from '../../api/sneakerApi';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function ProductDetailModal({ sneaker, onClose }) {
  const [variants, setVariants] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
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
          if (data && data.length > 0) {
            const defaultVariant = data.find(v => v.stockQuantity > 0) || data[0];
            setSelectedVariant(defaultVariant);
            setQuantity(1);
          }
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

  if (!sneaker) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-neutral-200 max-w-2xl w-full p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-neutral-100 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-neutral-100 border border-neutral-200 overflow-hidden">
            {sneaker.imageUrl && (
              <img
                src={sneaker.imageUrl}
                alt={sneaker.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 block mb-1">
                {sneaker.brand}
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                {sneaker.name}
              </h2>
              <span className="text-lg font-mono font-bold block mb-4">
                ${Number(sneaker.price).toFixed(2)}
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                {sneaker.description}
              </p>

              {/* Tallas / Variantes */}
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider block mb-2">
                  SELECCIONAR TALLA / STOCK
                </span>
                {loadingVariants ? (
                  <div className="text-xs font-mono text-neutral-400">Cargando tallas...</div>
                ) : variants.length === 0 ? (
                  <div className="text-xs font-mono text-neutral-500">No hay tallas registradas.</div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {variants.map((v) => (
                      <button
                        key={v.id}
                        disabled={v.stockQuantity <= 0}
                        onClick={() => {
                          setSelectedVariant(v);
                          setQuantity(1);
                        }}
                        className={`py-2 text-xs font-mono border transition-all ${selectedVariant?.id === v.id
                          ? 'bg-black text-white border-black'
                          : v.stockQuantity <= 0
                            ? 'bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed line-through'
                            : 'border-neutral-300 hover:border-black'
                          }`}
                      >
                        {v.size}
                        <span className="block text-[9px] opacity-70">
                          {v.stockQuantity > 0 ? `${v.stockQuantity}u` : 'Agotado'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ADD TO CART & QUANTITY */}
            <div className="mt-8 flex gap-4">
              
              {/* Quantity Selector */}
              <div className="flex items-center border-2 border-black flex-shrink-0">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={!selectedVariant || selectedVariant.stockQuantity <= 0 || quantity <= 1}
                  className="px-4 py-4 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-sm">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(q => Math.min(selectedVariant.stockQuantity, q + 1))}
                  disabled={!selectedVariant || selectedVariant.stockQuantity <= 0 || quantity >= selectedVariant.stockQuantity}
                  className="px-4 py-4 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${selectedVariant && selectedVariant.stockQuantity > 0
                  ? 'bg-black text-white hover:bg-neutral-800'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                onClick={() => {
                  addToCart(sneaker, selectedVariant, quantity);
                  onClose(); 
                  navigate('/cart');
                }}
              >
                {selectedVariant ? 'AÑADIR AL CARRITO' : 'SELECCIONA UNA TALLA'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
