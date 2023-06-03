import axios from 'axios'
// conexão com o banco
export const api = axios.create({
  baseURL: 'http://localhost:3333',
})
