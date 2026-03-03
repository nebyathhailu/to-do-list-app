import { useState } from 'react';
import api from '../utils/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, url, data = null, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api({ method, url, data, ...config });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
};