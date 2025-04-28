import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useContext, useEffect } from 'react';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api', // Sesuaikan dengan base URL API Anda
});

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});
export const useApi = () => {
    const { token } = useContext(AuthContext);

    useEffect(() => {
        api.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }, [token]);

    return api;
};

let navigate;

export const setNavigator = (navigator) => {
  navigate = navigator;
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token tidak valid atau kedaluarsa, lakukan logout otomatis
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect ke halaman login
      if (navigate) {
        navigate('/login');
      } else {
        console.error('Navigator tidak tersedia untuk melakukan redirect logout.');
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;