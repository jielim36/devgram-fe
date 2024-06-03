import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

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

// // 添加请求拦截器
// axiosClient.interceptors.request.use(
//     (config) => {
//         // 在发送请求之前做些什么，比如添加 Token
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers = config.headers || {};
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error: AxiosError): Promise<AxiosError> => {
//         // 对请求错误做些什么
//         return Promise.reject(error);
//     }
// );

axiosClient.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        return response;
    },
    (error: AxiosError): Promise<AxiosError> => {
        // 对响应错误做些什么
        if (error.response && error.response.status === 401) {
            // 处理未授权错误，例如重定向到登录页
            window.location.href = websiteURL + '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
