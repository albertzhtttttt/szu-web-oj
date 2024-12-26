<template>
  <div class="learning-dashboard">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="info">
        <h2>我的学习</h2>
        <p>随时管理您的学习进度</p>
      </div>
    </div>

    <!-- Tab 导航 -->
    <el-tabs v-model="activeTab" type="card" class="tabs">
      <el-tab-pane label="我的课程" name="courses"></el-tab-pane>
      <el-tab-pane label="待办事项" name="todos"></el-tab-pane>
      <el-tab-pane label="我的讨论" name="discussions"></el-tab-pane>
    </el-tabs>

    <!-- 主内容区域 -->
    <div class="content">
      <MyCourses v-show="activeTab === 'courses'" />
      <MyTodos v-show="activeTab === 'todos'" />
      <MyDiscussions v-show="activeTab === 'discussions'" />
    </div>
  </div>
</template>

<script>
import MyCourses from "./components/MyCourses.vue";
import MyTodos from "./components/MyTodos.vue";
import MyDiscussions from "./components/MyDiscussions.vue";

export default {
  components: {
    MyCourses,
    MyTodos,
    MyDiscussions,
  },
  data() {
    return {
      activeTab: "courses", // 默认显示“我的课程”
    };
  },
};
</script>

<style scoped>
.learning-dashboard {
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.header {
  max-width: 65%; /* 限制宽度为页面宽度的75% */
  margin: 0 auto; /* 居中 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.info h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #181818;
}

.info p {
  color: #888;
  margin-top: 5px;
}

.tabs {
  max-width: 65%; 
  margin: 0 auto; /* 居中 */
  margin-bottom: 20px;
}

.content {
  max-width: 65%; /* 限制宽度为页面宽度的65% */
  margin: 0 auto; /* 居中 */
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
