import { Tag } from 'ant-design-vue';
import type { TableColumn } from '@/components/core/dynamic-table';
import type { FormSchema } from '@/components/core/schema-form';

export type TableListItem = API.ServiceItemEntity;
export type TableColumnItem = TableColumn<TableListItem>;

const getLoadType = (record) => {
  switch (record.loadType) {
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

const getStatus = (record) => {
  switch (record.status) {
    case 0:
      return <Tag color="error">关闭</Tag>;
    case 1:
      return <Tag color="success">开启</Tag>;
  }
};

export const baseColumns: TableColumnItem[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 60,
  },
  {
    title: '服务名称',
    dataIndex: 'serviceName',
    width: 60,
  },
  {
    title: '服务描述',
    dataIndex: 'serviceDesc',
    width: 60,
  },
  {
    title: '服务名称',
    dataIndex: 'loadType',
    width: 60,
    customRender: ({ record }) => getLoadType(record),
  },
  {
    title: 'QPS',
    dataIndex: 'qps',
    width: 60,
  },
  {
    title: '节点数',
    dataIndex: 'totalNode',
    width: 60,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 60,
    customRender: ({ record }) => getStatus(record),
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'info',
    label: '关键词',
    component: 'Input',
    colProps: { span: 8 },
  },
];
