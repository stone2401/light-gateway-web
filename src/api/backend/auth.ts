// @ts-ignore
/* eslint-disable */
import { request, type RequestOptions } from '@/utils/request';

/** 登录 POST /api/auth/login */
export async function authLogin(body: API.LoginDto, options?: RequestOptions) {
  return request<API.LoginToken>('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册 POST /api/auth/register */
export async function authRegister(body: API.RegisterDto, options?: RequestOptions) {
  return request<any>('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 修改密码
export async function updatePassword(body: API.UpdatePasswd, options?: RequestOptions) {
  return request<any>('/api/v1/admin/change_pwd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
