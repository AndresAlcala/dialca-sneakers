import React, { useState } from 'react';
import { X, Plus, Package, Edit2, ChevronDown } from 'lucide-react';
import { sneakerApi } from '../../api/sneakerApi';

export default function AdminModal({ onClose, sneakers, refreshCatalog }) {
  const [activeTab, setActiveTab] = useState('drop'); // 'drop' or 'inventory' or 'edit'
  
  // Estado para Crear Drop
  const [dropData, setDropData] = useState({
    brand: '', name: '', price: '', description: '', imageUrl: ''
  });
  const [isSubmittingDrop, setIsSubmittingDrop] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Estado para Crear Variante
  const [selectedSneakerId, setSelectedSneakerId] = useState('');
  const [variantData, setVariantData] = useState({ size: '', color: '', stockQuantity: '' });
  const [isSubmittingVariant, setIsSubmittingVariant] = useState(false);

  // Estado para Editar Drop
  const [editSneakerId, setEditSneakerId] = useState('');
  const [editData, setEditData] = useState({
    brand: '', name: '', price: '', description: '', imageUrl: ''
  });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Cargar datos al seleccionar para editar
  const handleEditSelect = (e) => {
    const id = e.target.value;
    setEditSneakerId(id);
    const sneaker = sneakers.find(s => s.id.toString() === id.toString());
    if (sneaker) {
      setEditData({
        brand: sneaker.brand,
        name: sneaker.name,
        price: sneaker.price,
        description: sneaker.description,
        imageUrl: sneaker.imageUrl
      });
    }
  };

  const handleImageUpload = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const response = await sneakerApi.uploadImage(file);
      // El backend devuelve { url: '/uploads/...', message: '...' }
      // Debemos asegurar que la URL sea absoluta si el backend devuelve relativa y viceversa.
      // El frontend y backend asumen que /uploads/... se sirve estáticamente desde el backend en localhost:8080.
      const fullUrl = `http://localhost:8080${response.url}`;

      if (isEdit) {
        setEditData(prev => ({ ...prev, imageUrl: fullUrl }));
      } else {
        setDropData(prev => ({ ...prev, imageUrl: fullUrl }));
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDropSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingDrop(true);
    try {
      await sneakerApi.createSneaker({
        ...dropData,
        price: Number(dropData.price)
      });
      alert('¡Drop creado exitosamente!');
      setDropData({ brand: '', name: '', price: '', description: '', imageUrl: '' });
      if (refreshCatalog) refreshCatalog();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmittingDrop(false);
    }
  };

  const handleVariantSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSneakerId) return alert('Selecciona una zapatilla');
    setIsSubmittingVariant(true);
    try {
      await sneakerApi.createVariant(selectedSneakerId, {
        size: variantData.size.trim(),
        color: variantData.color || 'Default',
        stockQuantity: Number(variantData.stockQuantity)
      });
      alert('¡Talla y stock añadidos exitosamente!');
      setVariantData({ size: '', color: '', stockQuantity: '' });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmittingVariant(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editSneakerId) return alert('Selecciona una zapatilla para editar');
    setIsSubmittingEdit(true);
    try {
      await sneakerApi.updateSneaker(editSneakerId, {
        ...editData,
        price: Number(editData.price)
      });
      alert('¡Drop actualizado exitosamente!');
      setEditSneakerId('');
      setEditData({ brand: '', name: '', price: '', description: '', imageUrl: '' });
      if (refreshCatalog) refreshCatalog();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleArchiveSneaker = async () => {
    if (!editSneakerId) return;
    if (!window.confirm('¿Estás seguro de que deseas archivar este Drop? (Desaparecerá de la tienda pública pero se conservará en los registros)')) {
      return;
    }
    
    try {
      await sneakerApi.deleteSneaker(editSneakerId);
      alert('¡Drop archivado exitosamente!');
      setEditSneakerId('');
      setEditData({ brand: '', name: '', price: '', description: '', imageUrl: '' });
      if (refreshCatalog) refreshCatalog();
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-street-black text-white border-2 border-white max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
        
        {/* Header / Tabs */}
        <div className="flex border-b-2 border-white sticky top-0 bg-street-black z-10">
          <button 
            onClick={() => setActiveTab('drop')}
            className={`flex-1 p-4 font-black tracking-widest text-sm transition-colors flex items-center justify-center gap-2
              ${activeTab === 'drop' ? 'bg-supreme-red text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            <Plus className="w-4 h-4" /> CREAR DROP
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 p-4 font-black tracking-widest text-sm transition-colors flex items-center justify-center gap-2 border-l-2 border-white
              ${activeTab === 'inventory' ? 'bg-supreme-red text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            <Package className="w-4 h-4" /> INVENTARIO
          </button>
          <button 
            onClick={() => setActiveTab('edit')}
            className={`flex-1 p-4 font-black tracking-widest text-sm transition-colors flex items-center justify-center gap-2 border-l-2 border-white
              ${activeTab === 'edit' ? 'bg-supreme-red text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            <Edit2 className="w-4 h-4" /> EDITAR
          </button>
          <button
            onClick={onClose}
            className="p-4 border-l-2 border-white hover:bg-white hover:text-black transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {/* TAB 1: CREAR DROP */}
          {activeTab === 'drop' && (
            <form onSubmit={handleDropSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Marca</label>
                  <input required
                    className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors"
                    value={dropData.brand} onChange={e => setDropData({...dropData, brand: e.target.value})}
                    placeholder="Ej. NKE"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Modelo</label>
                  <input required
                    className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors"
                    value={dropData.name} onChange={e => setDropData({...dropData, name: e.target.value})}
                    placeholder="Ej. Air Max"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Precio ($)</label>
                  <input required type="number" step="0.01" min="0"
                    className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors"
                    value={dropData.price} onChange={e => setDropData({...dropData, price: e.target.value})}
                    placeholder="Ej. 150.00"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Imagen (Sube una foto)</label>
                  <input type="file" accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="w-full bg-transparent border-2 border-neutral-700 p-2 text-sm outline-none transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-black file:bg-white file:text-black hover:file:bg-supreme-red hover:file:text-white"
                  />
                  {uploadingImage && <span className="text-[10px] text-supreme-red mt-1 block">Subiendo imagen...</span>}
                  {dropData.imageUrl && (
                    <div className="mt-2 h-16 w-16 bg-neutral-800">
                      <img src={dropData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Descripción</label>
                <textarea required rows={3}
                  className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors resize-none"
                  value={dropData.description} onChange={e => setDropData({...dropData, description: e.target.value})}
                  placeholder="Historia o detalles del par..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmittingDrop}
                className="w-full bg-supreme-red hover:bg-white hover:text-black text-white font-black tracking-widest py-4 border-2 border-transparent hover:border-black transition-colors"
              >
                {isSubmittingDrop ? 'PROCESANDO...' : 'PUBLICAR DROP'}
              </button>
            </form>
          )}

          {/* TAB 2: INVENTARIO */}
          {activeTab === 'inventory' && (
            <form onSubmit={handleVariantSubmit} className="space-y-6">
              <div className="relative">
                <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Seleccionar Zapatilla</label>
                <div className="relative">
                  <select required
                    className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors text-white appearance-none cursor-pointer"
                    value={selectedSneakerId} onChange={e => setSelectedSneakerId(e.target.value)}
                  >
                    <option value="" disabled className="bg-black text-white">-- Elige un modelo --</option>
                    {sneakers?.map(s => (
                      <option key={s.id} value={s.id} className="bg-black text-white">
                        {s.brand} | {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="relative">
                  <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Talla (Formato Fijo)</label>
                  <div className="relative">
                    <select required
                      className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors text-white appearance-none cursor-pointer"
                      value={variantData.size} onChange={e => setVariantData({...variantData, size: e.target.value})}
                    >
                      <option value="" disabled className="bg-black text-white">-- Elige una talla --</option>
                      <option value="7 US / 40 EUR / 38 COL / 25 CM (MEN)" className="bg-black text-white">7 US / 40 EUR / 38 COL / 25 CM (MEN)</option>
                      <option value="7.5 US / 40.5 EUR / 38.5 COL / 25.5 CM (MEN)" className="bg-black text-white">7.5 US / 40.5 EUR / 38.5 COL / 25.5 CM (MEN)</option>
                      <option value="8.0 US / 41 EUR / 39 COL / 26 CM (MEN)" className="bg-black text-white">8.0 US / 41 EUR / 39 COL / 26 CM (MEN)</option>
                      <option value="8.5 US / 42 EUR / 40 COL / 26.5 CM (MEN)" className="bg-black text-white">8.5 US / 42 EUR / 40 COL / 26.5 CM (MEN)</option>
                      <option value="9.0 US / 42.5 EUR / 40.5 COL / 27 CM (MEN)" className="bg-black text-white">9.0 US / 42.5 EUR / 40.5 COL / 27 CM (MEN)</option>
                      <option value="9.5 US / 43 EUR / 41 COL / 27.5 CM (MEN)" className="bg-black text-white">9.5 US / 43 EUR / 41 COL / 27.5 CM (MEN)</option>
                      <option value="10 US / 44 EUR / 42 COL / 28 CM (MEN)" className="bg-black text-white">10 US / 44 EUR / 42 COL / 28 CM (MEN)</option>
                      <option value="10.5 US / 44.5 EUR / 42.5 COL / 28.5 CM (MEN)" className="bg-black text-white">10.5 US / 44.5 EUR / 42.5 COL / 28.5 CM (MEN)</option>
                      <option value="11 US / 45 EUR / 43 COL / 29 CM (MEN)" className="bg-black text-white">11 US / 45 EUR / 43 COL / 29 CM (MEN)</option>
                      <option value="11.5 US / 45.5 EUR / 43.5 COL / 29.5 CM (MEN)" className="bg-black text-white">11.5 US / 45.5 EUR / 43.5 COL / 29.5 CM (MEN)</option>
                      <option value="12 US / 46 EUR / 44 COL / 30 CM (MEN)" className="bg-black text-white">12 US / 46 EUR / 44 COL / 30 CM (MEN)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Color</label>
                  <input required
                    className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors"
                    value={variantData.color} onChange={e => setVariantData({...variantData, color: e.target.value})}
                    placeholder="Ej. Blanco/Negro"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Stock Físico</label>
                  <input required type="number" min="0" step="1"
                    className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors"
                    value={variantData.stockQuantity} onChange={e => setVariantData({...variantData, stockQuantity: e.target.value})}
                    placeholder="Ej. 10"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmittingVariant || !selectedSneakerId}
                className={`w-full font-black tracking-widest py-4 border-2 transition-colors ${
                  !selectedSneakerId || isSubmittingVariant 
                  ? 'bg-neutral-800 text-neutral-500 border-neutral-800 cursor-not-allowed'
                  : 'bg-supreme-red hover:bg-white hover:text-black text-white border-transparent hover:border-black'
                }`}
              >
                {isSubmittingVariant ? 'PROCESANDO...' : 'AÑADIR AL INVENTARIO'}
              </button>
            </form>
          )}

          {/* TAB 3: EDITAR DROP */}
          {activeTab === 'edit' && (
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="relative">
                <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Seleccionar Zapatilla a Editar</label>
                <div className="relative">
                  <select required
                    className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors text-white appearance-none cursor-pointer"
                    value={editSneakerId} onChange={handleEditSelect}
                  >
                    <option value="" disabled className="bg-black text-white">-- Elige un modelo --</option>
                    {sneakers?.map(s => (
                      <option key={s.id} value={s.id} className="bg-black text-white">
                        {s.brand} | {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {editSneakerId && (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Marca</label>
                      <input required
                        className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors"
                        value={editData.brand} onChange={e => setEditData({...editData, brand: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Modelo</label>
                      <input required
                        className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors"
                        value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Precio ($)</label>
                      <input required type="number" step="0.01" min="0"
                        className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors"
                        value={editData.price} onChange={e => setEditData({...editData, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Imagen (Cambiar foto)</label>
                      <input type="file" accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        className="w-full bg-transparent border-2 border-neutral-700 p-2 text-sm outline-none transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-black file:bg-white file:text-black hover:file:bg-supreme-red hover:file:text-white"
                      />
                      {uploadingImage && <span className="text-[10px] text-supreme-red mt-1 block">Subiendo imagen...</span>}
                      {editData.imageUrl && (
                        <div className="mt-2 h-16 w-16 bg-neutral-800">
                          <img src={editData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">Descripción</label>
                    <textarea required rows={3}
                      className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors resize-none"
                      value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmittingEdit}
                    className="w-full bg-supreme-red hover:bg-white hover:text-black text-white font-black tracking-widest py-4 border-2 border-transparent hover:border-black transition-colors"
                  >
                    {isSubmittingEdit ? 'PROCESANDO...' : 'GUARDAR CAMBIOS'}
                  </button>

                  <button 
                    type="button" 
                    onClick={handleArchiveSneaker}
                    className="w-full bg-transparent text-red-500 font-black tracking-widest py-4 border-2 border-red-500 hover:bg-red-500 hover:text-white transition-colors mt-4"
                  >
                    OCULTAR / ARCHIVAR DROP
                  </button>
                </>
              )}
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
