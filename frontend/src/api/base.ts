/// <reference types="vite/client" />
// The above needs to be used in the frontend to access the env related variables 
// This is the axios instance used for communicating with the backend
// It is created using the VITE_BACKEND environment variable .We store the sensitive info in the env files 
import axios from 'axios';
import ApiService from './utils/apiService';

// Environment variables (can be used for dynamic configuration later)
// const url = import.meta.env.VITE_BACKEND;
// const authorization = import.meta.env.VITE_AUTHORIZATION;

const base = axios.create({
    baseURL: "http://10.3.1.6:3000/",
    headers: {
        'authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NWQ3MjY2Y2M3MDU5ZTg4Yjc3YTM1MGYiLCJlbXBsb3llZUNvZGUiOiIxMDY3IiwiaWF0IjoxNzM4MzE0NDU4fQ.ay7KFLz8gTxIrcRt61IDQyNNRbz11wnxDhUS4UOlQoI",
        'Content-Type': 'application/json',
    }
});

export const local = axios.create({
    baseURL: "http://localhost:3000/",
    headers: {
        'Content-Type': 'application/json',
    }
});

// Create centralized API service instances
export const baseApiService = new ApiService(base);
export const localApiService = new ApiService(local);

export default base;