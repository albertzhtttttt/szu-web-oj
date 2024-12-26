<template>
    <div class="my-discussions">
      <h2>我的讨论</h2>
      <el-timeline>
        <el-timeline-item
          v-for="(discussion, index) in discussions"
          :key="index"
          :timestamp="discussion.time"
          placement="top"
        >
          <h3>{{ discussion.title }}</h3>
          <p>{{ discussion.content }}</p>
        </el-timeline-item>
      </el-timeline>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        discussions: [
          { title: "讨论主题1", content: "参与的讨论内容1", time: "2024-12-20" },
          { title: "讨论主题2", content: "参与的讨论内容2", time: "2024-12-18" },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .my-discussions {
    padding: 20px;
  }
  
  h3 {
    font-weight: bold;
  }
  </style>
  