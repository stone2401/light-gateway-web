<template>
  <div>
    <Card>
      <Divider orientation="left">修改密码</Divider>
      <Space>
        <schema-form ref="dynamicForm" v-bind="formProps" :subText="sub" @submit="handlerSub">
        </schema-form>
      </Space>
    </Card>
  </div>
</template>

<script setup lang="ts">
  import { Space, Card, Divider } from 'ant-design-vue';
  import { schemas } from './form-schema';
  import { SchemaForm, type SchemaFormProps } from '@/components/core/schema-form';

  import { ref } from 'vue';
  import Api from '@/api';
  defineOptions({
    name: 'DemoButton',
  });
  const sub = '添加';
  const dynamicForm = ref<InstanceType<typeof SchemaForm>>();
  const formProps: SchemaFormProps = { schemas, labelWidth: 120, actionColOptions: { span: 24 } };
  const handlerSub = async (values) => {
    await Api.auth.updatePassword(values);
  };
</script>
