<!-- src/pages/student/index.vue -->
<template>
  <div class="student-dashboard">
    <aside class="sidebar">
      <nav class="menu">
        <h2>学生面板</h2>
        <ul>
          <li><router-link to="/student/my-courses">我的课程</router-link></li>
          <li><router-link to="/student/todo-list">待办事项</router-link></li>
          <!-- 可以添加更多菜单项 -->
        </ul>
      </nav>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>

</script>

<style scoped>
.student-dashboard {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
}

.menu ul {
  list-style-type: none;
  padding: 0;
}

.menu ul li {
  margin-bottom: 10px;
}

.menu a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  display: block;
  padding: 8px 0;
}

.menu a.router-link-active {
  color: #007bff;
}

.content {
  flex-grow: 1;
  padding: 20px;
}
</style>