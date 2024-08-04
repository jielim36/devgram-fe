import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { error } from 'console';
import toast from 'react-hot-toast';

const baseURL = import.meta.env.VITE_SERVER_URL;
const websiteURL = import.meta.env.VITE_WEBSITE_URL;

const axiosClient: AxiosInstance = axios.create({
    baseURL: baseURL, // 你的 API 基础 URL
    timeout: 10000, // 请求超时时间
    withCredentials: true, // 跨域请求时发送 cookies
    headers: {
        'Content-Type': 'application/json',
        // 其他自定义头部配置
    }
});

// add token to request header
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    // (error: AxiosError): Promise<AxiosError> => {
    //     return Promise.reject(error);
    // }
);

const notify = (message: string) => {
    toast.error(message);
}

axiosClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse | any => {

        if (response.data.code !== "200") {
            const error = new Error(response.data.message || 'Error');
            return Promise.reject(error);
        }

        return response;
    },
    (error: AxiosError): Promise<AxiosError> => {
        // 对响应错误做些什么
        if (error.response && error.response.status === 401) {
            // 处理未授权错误，例如重定向到登录页
            notify('Unauthorized');
            // window.location.href = websiteURL + '/login';
        } else {
            // notify(error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
