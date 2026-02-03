import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器：添加公共参数
apiClient.interceptors.request.use(
  (config) => {
    // 添加公共请求头
    config.headers['X-API-Version'] = '1.0.0';
    config.headers['X-App-Id'] = 'nextjs-api-demo';
    config.headers['X-Request-Timestamp'] = new Date().toISOString();
    
    // 添加公共查询参数
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        api_version: '1.0.0',
        app_id: 'nextjs-api-demo',
      };
    }
    
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Headers:', config.headers);
    console.log('Params:', config.params);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理响应
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;