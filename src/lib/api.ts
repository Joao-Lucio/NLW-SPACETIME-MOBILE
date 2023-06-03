import axios from 'axios'
// conexão com o banco
export const api = axios.create({
  baseURL: 'http://192.168.100.54:3333',
})
