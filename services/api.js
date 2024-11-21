import axios from 'axios';

// Configuração base do Axios para facilitar as requisições
const api = axios.create({
  baseURL: 'http://192.168.1.10:5000/api', // Substitua pelo IP do servidor, se necessário
});

export default api;
