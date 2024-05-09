import { Tag } from 'ant-design-vue';
import type { FormSchema } from '@/components/core/schema-form';
import type { TableListItem } from './columns';

// const isHttp = (loadType: number) => loadType === 0;
// const isTcp = (loadType: number) => loadType === 1;
// const isRpc = (loadType: number) => loadType === 2;

const getLoadType = (num: number) => {
  switch (num) {
    case 0:
      return <Tag color="processing">HTTP</Tag>;
    case 1:
      return <Tag color="green">TCP</Tag>;
    case 2:
      return <Tag color="volcano">RPC</Tag>;
    case 3:
      return <Tag color="orange">UDP</Tag>;
  }
};

const getLoadBalance = (num: number) => {
  switch (num) {
    case 0:
      return '顺序轮询';
    case 1:
      return '随机轮询';
    case 2:
      return '权重轮询';
    case 3:
      return 'hash一致轮询';
  }
};

export const useServiceSchemas = (
  record: Partial<TableListItem>,
): FormSchema<API.ServiceInfoDao>[] => {
  return [
    {
      field: 'type',
      component: 'RadioGroup',
      label: '服务类型',
      componentProps: {
        options: [
          { label: getLoadType(0), value: 0 },
          { label: getLoadType(1), value: 1 },
          { label: getLoadType(2), value: 2 },
        ],
      },
      defaultValue: record?.loadType == undefined ? 0 : record?.loadType,
    },
    {
      field: 'serviceName',
      component: 'Input',
      label: '服务名称',
      rules: [{ required: true, type: 'string' }],
    },
    {
      field: 'serviceDesc',
      component: 'InputTextArea',
      label: '服务描述',
      rules: [{ type: 'string' }],
    },
    // service rule
    {
      field: 'ruleType',
      component: 'RadioGroup',
      label: '匹配类型',
      rules: [{ type: 'number', required: true }],
      componentProps: {
        options: [
          { label: 'url_prefix（url前缀）', value: 0 },
          { label: 'domain（域名）', value: 1 },
        ],
      },
    },
    {
      field: 'rule',
      component: 'Input',
      label: ({ formModel }) => (formModel['ruleType'] === 0 ? 'url_prefix' : 'domain'),
      rules: [{ type: 'string', required: true }],
    },
    {
      field: 'needHttps',
      component: 'RadioGroup',
      label: '代理类型',
      rules: [{ required: true, type: 'number' }],
      componentProps: {
        options: [
          { label: 'HTTP', value: 0 },
          { label: 'HTTPS', value: 1 },
        ],
      },
    },
    {
      field: 'needWebsocket',
      component: 'RadioGroup',
      label: 'websocket',
      componentProps: {
        options: [
          { label: '关启', value: 1 },
          { label: '开启', value: 1 },
        ],
      },
    },
    {
      field: 'headerTransfor',
      component: 'InputTextArea',
      label: 'header',
    },
    // 负载均衡
    {
      field: 'roundType',
      component: 'RadioGroup',
      label: '轮询方式',
      componentProps: {
        options: [
          { label: getLoadBalance(0), value: 0 },
          { label: getLoadBalance(1), value: 1 },
          { label: getLoadBalance(2), value: 2 },
          { label: getLoadBalance(3), value: 3 },
        ],
      },
      rules: [{ required: true, type: 'number' }],
      defaultValue: record?.loadType == undefined ? 0 : record?.loadType,
    },
  ];
};
