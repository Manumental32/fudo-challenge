import axios from 'axios';

export const http = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    'https://665de6d7e88051d60408c32d.mockapi.io',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
});
