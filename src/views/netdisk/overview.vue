<template>
  <div class="netdisk-overview-container">
    <div class="ov-header">
      <OverviewHeaderItem title="服务数" :value="serviceNum" suffix="个" />
      <OverviewHeaderItem title="当日请求" :value="dayQps" suffix="次" />
      <OverviewHeaderItem title="当前QPS" :value="nowQps" suffix="" />
      <OverviewHeaderItem title="开启服务" :value="openService" suffix="个" />
    </div>
    <div class="ov-content">
      <Card shadow="hover">
        <Tabs v-model="actionTabName" destroy-inactive-tab-pane>
          <Tabs.TabPane key="flow" tab="总请求情况">
            <v-chart :option="flowChartOption" style="height: 320px" autoresize />
          </Tabs.TabPane>
          <!-- <Tabs.TabPane key="space" tab="容量趋势">
            <VChart :option="spaceChartOption" style="height: 320px" autoresize />
          </Tabs.TabPane> -->
        </Tabs>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { TooltipComponent, GridComponent } from 'echarts/components';
  import VChart from 'vue-echarts';
  import { LineChart } from 'echarts/charts';
  import { Card, Tabs } from 'ant-design-vue';
  import OverviewHeaderItem from './components/overview-header-item.vue';
  import type { TitleComponentOption, TooltipComponentOption } from 'echarts/components';
  import type {
    ComposeOption,
    LineSeriesOption,
    XAXisOption,
    YAXisOption,
  } from 'echarts/types/dist/shared.js';
  import Api from '@/api';

  type ECOption = ComposeOption<
    TitleComponentOption | TooltipComponentOption | XAXisOption | YAXisOption | LineSeriesOption
  >;

  use([CanvasRenderer, TooltipComponent, GridComponent, LineChart]);
  defineOptions({
    name: 'NetDiskOverview',
  });
  const loading = ref(false);
  // header
  const serviceNum = ref(0);
  const dayQps = ref(0);
  const nowQps = ref(0);
  const openService = ref(0);
  // content
  const actionTabName = ref('flow');
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

  const initData = async () => {
    try {
      showLoading();
      const data = await Api.dashboard.dashboard(0);
      // @ts-ignore chart
      flowChartOption.value.xAxis!.data = data.times;
      flowChartOption.value.series![0].data = data.datas;
      flowChartOption.value.series![1].data = data.yesterDates;
      serviceNum.value = data.serviceNum;
      dayQps.value = data.todayRequestNum;
      nowQps.value = data.currentQps;
      openService.value = data.openService;
    } finally {
      hideLoading();
    }
  };
  const showLoading = () => {
    loading.value = true;
  };
  const hideLoading = () => {
    loading.value = false;
  };

  initData();
</script>

<style lang="less" scoped>
  .netdisk-overview-container {
    margin: 20px;

    .ov-header {
      display: flex;
      flex-direction: row;
      margin-left: -20px;
    }

    .ov-content {
      margin: 20px 0;
    }
  }
</style>
