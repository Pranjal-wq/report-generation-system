import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast as reactToast } from 'react-toastify';

interface ToastContextType {
    showSuccess: (message: string, id?: string) => void;
    showError: (message: string, id?: string) => void;
    showInfo: (message: string, id?: string) => void;
    showWarning: (message: string, id?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const showSuccess = (message: string, id?: string) => {
        if (id) {
            reactToast.success(message, { toastId: id });
        } else {
            reactToast.success(message);
        }
    };

    const showError = (message: string, id?: string) => {
        if (id) {
            reactToast.error(message, { toastId: id });
        } else {
            reactToast.error(message);
        }
    };

    const showInfo = (message: string, id?: string) => {
        if (id) {
            reactToast.info(message, { toastId: id });
        } else {
            reactToast.info(message);
        }
    };

    const showWarning = (message: string, id?: string) => {
        if (id) {
            reactToast.warning(message, { toastId: id });
        } else {
            reactToast.warning(message);
        }
    };

    return (
        <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Bounce}
            />
        </ToastContext.Provider>
    );
};
