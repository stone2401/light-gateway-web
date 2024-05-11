import { Tag } from 'ant-design-vue';
import type { FormSchema } from '@/components/core/schema-form';
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

export function useServiceSchemas(
  record: API.ServiceInfoDao | null,
): FormSchema<API.ServiceInfoDao>[] {
  console.log(record);
  return [
    {
      field: 'loadType',
      component: 'RadioGroup',
      label: '服务类型',
      componentProps: {
        options: [
          { label: getLoadType(0), value: 0 },
          { label: getLoadType(1), value: 1 },
          { label: getLoadType(2), value: 2 },
        ],
      },
      vShow: record === null,
      defaultValue: record?.loadType == undefined ? 0 : record?.loadType,
    },
    {
      field: 'serviceName',
      component: 'Input',
      label: '服务名称',
      rules: [{ required: true, type: 'string' }],
      defaultValue: record?.serviceName === undefined ? '' : record.serviceName,
    },
    {
      field: 'serviceDesc',
      component: 'InputTextArea',
      label: '服务描述',
      rules: [{ type: 'string' }],
      defaultValue: record?.serviceDesc === undefined ? '' : record.serviceDesc,
    },
    // service rule http
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
      vIf: ({ formModel }) => {
        console.log(formModel, formModel.loadType === 0 ? true : false);
        return formModel.loadType === 0 ? true : false;
      },
      defaultValue: record?.ruleType === undefined ? 0 : record.ruleType,
    },
    {
      field: 'rule',
      component: 'Input',
      label: ({ formModel }) => (formModel['ruleType'] === 0 ? 'url_prefix' : 'domain'),
      rules: [{ type: 'string', required: true }],
      vIf: ({ formModel }) => {
        return formModel.loadType == 0 ? true : false;
      },
      defaultValue: record?.rule === undefined ? '' : record.rule,
    },
    {
      field: 'needHttps',
      component: 'RadioGroup',
      label: '代理类型',
      componentProps: {
        options: [
          { label: 'HTTP', value: false },
          { label: 'HTTPS', value: true },
        ],
      },
      vIf: ({ formModel }) => {
        return formModel.loadType == 0 ? true : false;
      },
      defaultValue: record?.needHttps === undefined ? false : record.needHttps,
    },
    {
      field: 'needWebsocket',
      component: 'RadioGroup',
      label: 'websocket',
      componentProps: {
        options: [
          { label: '关启', value: false },
          { label: '开启', value: true },
        ],
      },
      vIf: ({ formModel }) => {
        return formModel.loadType == 0 ? true : false;
      },
      defaultValue: record?.needHttps === undefined ? false : record.needHttps,
    },
    {
      field: 'urlRewrite',
      component: 'InputTextArea',
      label: 'url重写',
      vIf: ({ formModel }) => {
        return formModel.loadType == 0 ? true : false;
      },
      defaultValue: record?.urlRewrite === undefined ? '' : record.urlRewrite,
      helpMessage: '^/aaa/{.*} /bbb/$1',
    },
    {
      field: 'headerTransfor',
      component: 'InputTextArea',
      label: 'header',
      vIf: ({ formModel }) => {
        return formModel.loadType == 0 ? true : false;
      },
      defaultValue: record?.headerTransfor === undefined ? '' : record.headerTransfor,
      helpMessage: 'add headername headervalue',
    },
    // service rule tcp
    {
      field: 'port',
      component: 'InputNumber',
      label: '端口',
      rules: [{ required: true, type: 'number', max: 65535, min: 1000 }],
      vIf: ({ formModel }) => {
        return !(formModel.loadType == 0 ? true : false);
      },
      defaultValue: record?.port === undefined ? 8080 : record.port,
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
      defaultValue: record?.roundType == undefined ? 0 : record?.roundType,
    },
    {
      field: 'ipList',
      component: 'InputTextArea',
      label: 'ip列表',
      defaultValue: record?.ipList === undefined ? '' : record.ipList,
      helpMessage: 'ip1,ip2,ip3',
    },
    {
      field: 'weightList',
      component: 'InputTextArea',
      label: '权证列表',
      defaultValue: record?.weightList === undefined ? '' : record.weightList,
      helpMessage: 'ip_wight_1,ip_wight_2,ip_wight_3',
    },
    {
      field: 'blacklist',
      component: 'InputTextArea',
      label: '黑名单',
      defaultValue: record?.blacklist === undefined ? '' : record.blacklist,
      helpMessage: 'ip1,ip2,ip3',
    },
    {
      field: 'whiteList',
      component: 'InputTextArea',
      label: '白名单',
      defaultValue: record?.whiteList === undefined ? '' : record.whiteList,
      helpMessage: 'ip1,ip2,ip3',
    },
    {
      field: 'status',
      component: 'RadioGroup',
      label: '开关',
      componentProps: {
        options: [
          { label: '关', value: 0 },
          { label: '开', value: 1 },
        ],
      },
      defaultValue: record?.status === undefined ? 1 : record.status,
    },
  ];
}
