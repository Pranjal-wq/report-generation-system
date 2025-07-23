import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

interface ApiServiceConfig {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  toastId?: string;
}

interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

class ApiService {
  private activeToasts = new Set<string>();

  constructor(private axiosInstance: AxiosInstance) {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add any request modifications here
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Handle global error responses
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  private showToast(type: 'success' | 'error' | 'info' | 'warning', message: string, toastId?: string) {
    const id = toastId || `${type}-${Date.now()}`;
    
    // Prevent duplicate toasts
    if (this.activeToasts.has(id)) {
      return;
    }

    this.activeToasts.add(id);

    const toastOptions = {
      toastId: id,
      onClose: () => {
        this.activeToasts.delete(id);
      }
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'info':
        toast.info(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
    }
  }
  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig & ApiServiceConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
      
      if (config?.showSuccessToast && config?.successMessage) {
        this.showToast('success', config.successMessage, config.toastId);
      }

      return {
        data: response.data,
        success: true,
        message: 'Request successful'
      };    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = config?.errorMessage || 
        axiosError.response?.data?.message || 
        `Failed to fetch data from ${url}`;

      if (config?.showErrorToast !== false) {
        this.showToast('error', errorMessage, config?.toastId);
      }

      throw {
        data: null,
        success: false,
        message: errorMessage,
        error
      };
    }
  }
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & ApiServiceConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
      
      if (config?.showSuccessToast && config?.successMessage) {
        this.showToast('success', config.successMessage, config.toastId);
      }

      return {
        data: response.data,
        success: true,
        message: 'Request successful'
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = config?.errorMessage || 
        axiosError.response?.data?.message || 
        `Failed to post data to ${url}`;

      if (config?.showErrorToast !== false) {
        this.showToast('error', errorMessage, config?.toastId);
      }

      throw {
        data: null,
        success: false,
        message: errorMessage,
        error
      };
    }
  }
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig & ApiServiceConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
      
      if (config?.showSuccessToast && config?.successMessage) {
        this.showToast('success', config.successMessage, config.toastId);
      }

      return {
        data: response.data,
        success: true,
        message: 'Request successful'
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = config?.errorMessage || 
        axiosError.response?.data?.message || 
        `Failed to update data at ${url}`;

      if (config?.showErrorToast !== false) {
        this.showToast('error', errorMessage, config?.toastId);
      }

      throw {
        data: null,
        success: false,
        message: errorMessage,
        error
      };
    }
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig & ApiServiceConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
      
      if (config?.showSuccessToast && config?.successMessage) {
        this.showToast('success', config.successMessage, config.toastId);
      }

      return {
        data: response.data,
        success: true,
        message: 'Request successful'
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = config?.errorMessage || 
        axiosError.response?.data?.message || 
        `Failed to delete data from ${url}`;

      if (config?.showErrorToast !== false) {
        this.showToast('error', errorMessage, config?.toastId);
      }

      throw {
        data: null,
        success: false,
        message: errorMessage,
        error
      };
    }
  }

  // Utility method to manually show toasts
  showSuccess(message: string, toastId?: string) {
    this.showToast('success', message, toastId);
  }

  showError(message: string, toastId?: string) {
    this.showToast('error', message, toastId);
  }

  showInfo(message: string, toastId?: string) {
    this.showToast('info', message, toastId);
  }

  showWarning(message: string, toastId?: string) {
    this.showToast('warning', message, toastId);
  }
}

export default ApiService;
