// API响应类型定义
export interface ApiResponse {
  message: string;
  timestamp: string;
  method: string;
  status?: string;
  received?: {
    name: string;
    message: string;
  };
  middlewareParams?: {
    headers: {
      'X-API-Version'?: string;
      'X-App-Id'?: string;
      'X-Request-Timestamp'?: string;
    };
    queryParams?: {
      api_version?: string;
      app_id?: string;
    };
  };
}