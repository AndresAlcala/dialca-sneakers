import { useState, useEffect } from 'react';
import { sneakerApi } from '../api/sneakerApi';

export function useSneakers() {
  const [sneakers, setSneakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSneakers = async () => {
    try {
      setLoading(true);
      const data = await sneakerApi.getSneakers();
      setSneakers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSneakers();
  }, []);

  return { sneakers, loading, error, refreshSneakers: fetchSneakers };
}
