<template>
  <Card>
    <div ref="markdown" class="markdown-body"> 111111</div>
  </Card>
</template>

<script setup lang="ts">
  import { Card } from 'ant-design-vue';
  import { marked } from 'marked';
  import { ref, reactive, onMounted } from 'vue';
  import 'github-markdown-css';
  import Api from '@/api';
  import { da } from '@faker-js/faker';
  let mark = `
  # 标题1
  > 这是markdown测试
  1. 测试
  2. 测试2
  3. 测试3
  `;
  const markdown = ref<HTMLDivElement | null>(null);

  onMounted(async () => {
    // # markdown
    let data = await Api.systemServe.serveHelpMarkdown();
    console.log(data);
    (markdown.value as HTMLDivElement).innerHTML = await marked(data);
  });
</script>
<style lang="less" scoped>
  /* 确保背景是白色，且文本颜色足够深 */
  .markdown-body {
    background-color: white; /* 白色背景 */
    color: #333; /* 深色文本，增加可读性 */
  }

  /* 你也可以针对特定的元素设置样式 */
  .markdown-body h1,
  .markdown-body h2,
  .markdown-body h3,
  .markdown-body h4,
  .markdown-body h5,
  .markdown-body h6 {
    color: #333; /* 标题使用更深的颜色 */
  }

  .markdown-body a {
    color: #0366d6; /* 链接颜色 */
  }

  .markdown-body code {
    background-color: #f6f8fa; /* 代码块背景色 */
    color: #24292e; /* 代码块文本颜色 */
  }
</style>
