import { request, type RequestOptions } from '@/utils/request';

export async function serviceList(paramse: API.ServiceListParams, options?: RequestOptions) {
  return request<{
    items?: API.ServiceItemEntity[];
    meta?: {
      itemCount?: number;
      totalItems?: number;
      itemsPerPage?: number;
      totalPages?: number;
      currentPage?: number;
    };
  }>('/api/v1/service/', {
    method: 'GET',
    params: {
      ...paramse,
    },
    ...(options || {}),
  });
}

export async function serviceDelete(params: API.ServiceDeleteParams, options?: RequestOptions) {
  return request<any>('/api/v1/service/' + params.id, {
    method: 'DELETE',
    params: {},
    ...(options || {}),
  });
}

export async function serviceInfo(params: API.ServiceDeleteParams, options?: RequestOptions) {
  return request<API.ServiceInfoDao>('/api/v1/service/' + params.id, {
    method: 'GET',
    params: {},
    ...(options || {}),
  });
}
