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
      <a-button type="primary" @click="openMenuModal({})">新增</a-button>
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
    const [formRef] = await showModal({
      modalProps: {
        title: `${record.id ? '编辑' : '新增'}服务`,
        width: '50%',
        onFinish: async (values) => {
          record.id && (values.roleId = record.id);
          const menusRef = formRef?.compRefMap.get('menuIds')!;
          const params = {
            ...values,
            menuIds: [...menusRef.halfCheckedKeys, ...menusRef.checkedKeys],
          };
          console.log('新增/编辑服务', params);
          if (record.id) {
            // await Api.systemRole.roleUpdate({ id: record.id }, params);
            console.log('新增/编辑服务', params);
          } else {
            // await Api.systemRole.roleCreate(params);
            console.log('新增/编辑服务', params);
          }

          dynamicTableInstance?.reload();
        },
      },
      formProps: {
        labelWidth: 100,
        schemas: useServiceSchemas(record),
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
            // onConfirm: () => delRowConfirm(record),
            onConfirm: () => deleteService(record.id),
          },
        },
      ],
    },
  ];
</script>
<style lang="less" scoped />
