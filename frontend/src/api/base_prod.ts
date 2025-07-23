/// <reference types="vite/client" />
// The above needs to be used in the frontend to access the env related variables 
// This is the axios instance used for communicating with the backend
// It is created using the VITE_BACKEND environment variable .We store the sensitive info in the env files 
import axios from 'axios';
const base = axios.create({
    baseURL: "https://att-stu.manit.ac.in/",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        // 'Accept': '*/*',
        // 'Accept-Encoding': 'gzip, deflate, br',
        // 'Connection': 'keep-alive'
    }
});

export const local = axios.create({
    baseURL: "https://att-stu.manit.ac.in/api/report",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        // 'Accept': '*/*',
        // 'Accept-Encoding': 'gzip, deflate, br',
        // 'Connection': 'keep-alive'
    }
});

export default base;