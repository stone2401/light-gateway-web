import { request, type RequestOptions } from '@/utils/request';

/** 获取服务器运行信息 GET /api/system/serve/stat */
export async function serveStat(options?: RequestOptions) {
  return request<API.ServeStatInfo>('/api/v1/system/serve/stat', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function dashboard(options?: RequestOptions) {
  return request<API.ServiceDashboardResponse>('/api/v1/dashboard/0', {
    method: 'GET',
    ...(options || {}),
  });
}
