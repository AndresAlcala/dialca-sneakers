import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { sneakerApi } from '../../api/sneakerApi';

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await sneakerApi.login(email, password);
      onLoginSuccess(response.token, response.role);
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-street-black text-white border-2 border-white max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white hover:text-black transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
              <Lock className="w-5 h-5 text-supreme-red" />
            </div>
          </div>
          
          <h2 className="text-xl font-black uppercase tracking-widest text-center mb-8">
            Acceso Autorizado
          </h2>

          {error && (
            <div className="bg-supreme-red text-white p-3 text-xs font-mono mb-6 text-center border border-white">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">
                Email
              </label>
              <input
                required
                type="email"
                className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dialca.com"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black tracking-widest mb-2 uppercase">
                Contraseña
              </label>
              <input
                required
                type="password"
                className="w-full bg-transparent border-2 border-neutral-700 focus:border-supreme-red p-3 text-sm outline-none transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-supreme-red hover:text-white font-black tracking-widest py-4 transition-colors uppercase text-sm mt-4 border-2 border-transparent hover:border-black"
            >
              {isLoading ? 'Autenticando...' : 'Entrar al Sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
