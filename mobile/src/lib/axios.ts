import axios from 'axios';

export const API = axios.create({
    baseURL: 'http://192.168.5.67:3333'
})