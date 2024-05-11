<template>
  <DynamicTable
    row-key="id"
    header-title="服务列表"
    bordered
    size="small"
    :data-request="Api.service.serviceList"
    :columns="columns"
  >
    <template #toolbar>
      <a-button type="primary" :disabled="!$auth('system:menu:create')" @click="openMenuModal({})"
        >新增</a-button
      >
    </template>
  </DynamicTable>
</template>

<script setup lang="ts">
  import {
    baseColumns,
    searchFormSchema,
    type TableColumnItem,
    type TableListItem,
  } from './columns';
  import { useTable } from '@/components/core/dynamic-table';
  import Api from '@/api/';
  import { useFormModal } from '@/hooks/useModal';
  import { useServiceSchemas } from './formSchemas';
  const [showModal] = useFormModal();
  const [DynamicTable, dynamicTableInstance] = useTable({
    formProps: {
      schemas: searchFormSchema,
    },
  });

  // 删除 service
  const deleteService = async (id: number) => {
    await Api.service.serviceDelete({ id });
    dynamicTableInstance?.reload();
  };

  /**
   * @description 打开新增/编辑弹窗
   */
  const openMenuModal = async (record: Partial<TableListItem>) => {
    let serviceInfo: API.ServiceInfoDao | null = null;
    if (record.id !== undefined) {
      serviceInfo = await Api.service.serviceInfo({ id: record.id });
    }
    await showModal({
      modalProps: {
        title: `${record.id ? '编辑' : '新增'}服务`,
        width: '50%',
        onFinish: async (values) => {
          if (record.id) {
            console.log('编辑服务', values as API.ServiceInfoDao);
            switch (values.loadType) {
              case 0:
                await Api.service.serviceUpdateHttp(record.id, values);
                break;
              case 1:
                await Api.service.serviceUpdateTcp(record.id, values);
                break;
              case 2:
                await Api.service.serviceUpdateGrpc(record.id, values);
                break;
              default:
                break;
            }
          } else {
            switch (values.loadType) {
              case 0:
                await Api.service.serviceCreateHttp(values);
                break;
              case 1:
                await Api.service.serviceCreateTcp(values);
                break;
              case 2:
                await Api.service.serviceCreateGrpc(values);
                break;
              default:
                break;
            }
          }

          dynamicTableInstance?.reload();
        },
      },
      formProps: {
        labelWidth: 100,
        schemas: useServiceSchemas(serviceInfo),
      },
    });
  };

  const columns: TableColumnItem[] = [
    ...baseColumns,
    {
      title: '操作',
      width: 130,
      dataIndex: 'ACTION',
      hideInSearch: true,
      fixed: 'right',
      actions: ({ record }) => [
        {
          label: '统计',
          auth: {
            perm: 'system:role:update',
            effect: 'disable',
          },
          onClick: () => {
            // openMenuModal(record);
            console.log('record', record);
          },
        },
        {
          label: '编辑',
          auth: {
            perm: 'system:role:update',
            effect: 'disable',
          },
          onClick: () => {
            openMenuModal(record);
            console.log('record', record);
          },
        },
        {
          label: '删除',
          auth: 'system:role:delete',
          popConfirm: {
            title: '你确定要删除吗？',
            placement: 'left',
            onConfirm: () => deleteService(record.id),
          },
        },
      ],
    },
  ];
</script>
<style lang="less" scoped />
