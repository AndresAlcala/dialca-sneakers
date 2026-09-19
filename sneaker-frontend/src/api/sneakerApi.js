const API_BASE_URL = 'http://localhost:8080/api';
const API_URL = 'http://localhost:8080/api/sneakers';
const AUTH_URL = 'http://localhost:8080/api/auth';

let authToken = localStorage.getItem('token');

export const sneakerApi = {
  setToken: (token) => {
    authToken = token;
    localStorage.setItem('token', token);
  },

  logout: () => {
    authToken = null;
    localStorage.removeItem('token');
  },

  login: async (email, password) => {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Credenciales incorrectas');
    return response.json();
  },

  /**
   * Obtiene la lista completa de zapatillas.
   */
  getSneakers: async () => {
    const response = await fetch(`${API_BASE_URL}/sneakers`);
    if (!response.ok) {
      throw new Error('Error al cargar el catálogo');
    }
    return response.json();
  },

  /**
   * Obtiene las tallas (variantes) de una zapatilla específica.
   * @param {number} sneakerId 
   */
  getVariants: async (sneakerId) => {
    const response = await fetch(`${API_BASE_URL}/sneakers/${sneakerId}/variants`);
    if (!response.ok) {
      throw new Error('Error al cargar tallas');
    }
    return response.json();
  },

  /**
   * Crea un nuevo modelo de zapatilla (DROP).
   */
  createSneaker: async (sneakerData) => {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(sneakerData),
    });
    if (!response.ok) {
      if (response.status === 403) throw new Error('No autorizado (Debes iniciar sesión como Admin)');
      throw new Error('Error al crear el drop');
    }
    return response.json();
  },

  /**
   * Actualiza un modelo de zapatilla existente.
   */
  updateSneaker: async (id, sneakerData) => {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(sneakerData),
    });
    if (!response.ok) {
      if (response.status === 403) throw new Error('No autorizado');
      throw new Error('Error al actualizar el drop');
    }
    return response.json();
  },

  /**
   * Añade una nueva variante (talla/color y stock) a un modelo de zapatilla.
   */
  createVariant: async (sneakerId, variantData) => {
    // Según la API que vi antes (SneakerVariantController), el endpoint suele ser /sneakers/{id}/variants, o tal vez se hace por un controlador independiente.
    // Usaremos el estándar REST /sneakers/{id}/variants
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const response = await fetch(`${API_URL}/${sneakerId}/variants`, {
      method: 'POST',
      headers,
      body: JSON.stringify(variantData),
    });
    if (!response.ok) {
      if (response.status === 403) throw new Error('No autorizado (Debes iniciar sesión como Admin)');
      throw new Error('Error al añadir talla/stock');
    }
    return response.json();
  }
};
