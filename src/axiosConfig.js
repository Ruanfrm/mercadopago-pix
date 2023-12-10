// Arquivo de configuração axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.mercadopago.com',
});

api.interceptors.request.use(async (config) => {
  const token = process.env.REACT_APP_TOKEN_MERCADO_PAGO;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
