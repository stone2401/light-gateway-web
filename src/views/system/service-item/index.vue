<template>
  <div>
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
    <a-modal v-model:open="open" title="统计" @ok="handleOk" style="width: 1080px">
      <v-chart :option="flowChartOption" style="height: 420px" autoresize></v-chart>
    </a-modal>
  </div>
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
  import { ref } from 'vue';
  const [showModal] = useFormModal();
  const [DynamicTable, dynamicTableInstance] = useTable({
    formProps: {
      schemas: searchFormSchema,
    },
  });
  // 统计部分
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { TooltipComponent, GridComponent } from 'echarts/components';
  import VChart from 'vue-echarts';
  import { LineChart } from 'echarts/charts';
  import type { TitleComponentOption, TooltipComponentOption } from 'echarts/components';
  import type {
    ComposeOption,
    LineSeriesOption,
    XAXisOption,
    YAXisOption,
  } from 'echarts/types/dist/shared.js';

  type ECOption = ComposeOption<
    TitleComponentOption | TooltipComponentOption | XAXisOption | YAXisOption | LineSeriesOption
  >;

  use([CanvasRenderer, TooltipComponent, GridComponent, LineChart]);
  // ----------------------------
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
            showEchartModal(record);
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

  // 统计部分
  const open = ref(false);
  const loading = ref(false);

  const showLoading = () => {
    loading.value = true;
  };
  const hideLoading = () => {
    loading.value = false;
  };
  const initData = async (record: Partial<TableListItem>) => {
    try {
      showLoading();
      const data = await Api.dashboard.dashboard(record.id === undefined ? 0 : record.id);
      // @ts-ignore chart
      flowChartOption.value.xAxis!.data = data.times;
      flowChartOption.value.series![0].data = data.datas;
      flowChartOption.value.series![1].data = data.yesterDates;
    } finally {
      hideLoading();
    }
  };
  const showEchartModal = (record: Partial<TableListItem>) => {
    open.value = true;
    initData(record);
  };
  const handleOk = () => {
    open.value = false;
  };
  const flowChartOption = ref<ECOption>({
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        return `
        <div>${params[0].name}号</div><div>${params[0].marker} ${params[0].seriesName}：${params[0].value}次</div>
        <div>${params[1].marker} ${params[1].seriesName}：${params[1].value}次</div>`;
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      data: [],
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '{value}次' },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    grid: {
      show: false,
      top: '5%',
      right: '2%',
      left: '5%',
      bottom: '8%',
    },
    series: [
      {
        name: '今日请求',
        data: [],
        type: 'line',
        smooth: 0.6,
        areaStyle: {
          color: '#8cc6f2',
        },
        itemStyle: {
          opacity: 0,
        },
        lineStyle: {
          color: '#8cc6f2',
        },
      },
      {
        name: '昨日请求',
        data: [],
        type: 'line',
        smooth: 0.6,
        areaStyle: {
          color: '#FFBF00',
        },
        itemStyle: {
          opacity: 0,
        },
        lineStyle: {
          color: '#FFBF00',
        },
      },
    ],
  });
</script>
<style lang="less" scoped />
