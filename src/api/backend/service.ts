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

export async function serviceCreateHttp(data: API.ServiceInfoDao, options?: RequestOptions) {
  return request<any>('/api/v1/service/http', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options || { successMsg: '添加成功' }),
  });
}

export async function serviceCreateTcp(data: API.ServiceInfoDao, options?: RequestOptions) {
  return request<any>('/api/v1/service/tcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options || { successMsg: '添加成功' }),
  });
}

export async function serviceCreateGrpc(data: API.ServiceInfoDao, options?: RequestOptions) {
  return request<any>('/api/v1/service/rpc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options || { successMsg: '添加成功' }),
  });
}

export async function serviceUpdateHttp(
  id: number,
  data: API.ServiceInfoDao,
  options?: RequestOptions,
) {
  return request<any>('/api/v1/service/http/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options || { successMsg: '编辑成功' }),
  });
}

export async function serviceUpdateTcp(
  id: number,
  data: API.ServiceInfoDao,
  options?: RequestOptions,
) {
  return request<any>('/api/v1/service/tcp/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options || { successMsg: '编辑成功' }),
  });
}

export async function serviceUpdateGrpc(
  id: number,
  data: API.ServiceInfoDao,
  options?: RequestOptions,
) {
  return request<any>('/api/v1/service/rpc/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    ...(options || { successMsg: '编辑成功' }),
  });
}
