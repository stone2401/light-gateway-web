import type { FormSchema } from '@/components/core/schema-form/';

let newPasswd: string = '';
export const schemas: FormSchema[] = [
  {
    field: 'old_password',
    component: 'InputPassword',
    label: '原密码',
    colProps: {
      span: 15,
    },
    required: true,
  },
  {
    field: 'new_password',
    component: 'InputPassword',
    label: '新密码',
    colProps: {
      span: 15,
    },
    required: true,
    rules: [
      {
        required: true,
        trigger: 'change',
        validator: async (rule, value) => {
          newPasswd = value as string;
        },
      },
    ],
  },
  {
    field: 'again_password',
    component: 'InputPassword',
    label: '确认新密码',
    colProps: {
      span: 15,
    },
    required: true,
    rules: [
      {
        required: true,
        trigger: 'change',
        validator: async (rule, value) => {
          if (newPasswd !== value) {
            return Promise.reject('两次密码输入不一致');
          }
          return Promise.resolve();
        },
      },
    ],
  },
];
