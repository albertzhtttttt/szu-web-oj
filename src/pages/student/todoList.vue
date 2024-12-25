<!-- src/pages/student/todoList.vue -->
<template>
    <div class="todo-list-container">
      <header class="page-header">
        <h2>个人待办事项</h2>
        <p>查看您的学习任务和已完成的任务。</p>
      </header>
  
      <!-- 待办事项 -->
      <section v-if="pendingTasks.length > 0" class="task-section">
        <h3>待办事项</h3>
        <ul class="task-list">
          <li v-for="task in pendingTasks" :key="task.id" class="task-item">
            <span>{{ task.description }}</span>
            <span class="badge">{{ task.type }}</span>
            <button v-if="task.type === '提交作业'" @click="showAssignmentForm(task)" class="btn btn-sm btn-primary">提交</button>
          </li>
        </ul>
      </section>
      <p v-else class="no-tasks">暂无待办事项。</p>
  
      <!-- 已完成事项 -->
      <section v-if="completedTasks.length > 0" class="task-section">
        <h3>已完成事项</h3>
        <ul class="task-list">
          <li v-for="task in completedTasks" :key="task.id" class="task-item">
            <span>{{ task.description }}</span>
            <span class="badge text-success">{{ task.type }}</span>
            <span v-if="task.result" class="text-success">评测结果: {{ task.result }}</span>
          </li>
        </ul>
      </section>
      <p v-else class="no-tasks">暂无已完成事项。</p>
  
      <!-- 提交作业表单 -->
      <SubmitAssignment v-if="selectedTask" @close="closeModal" :initialData="selectedTask.data" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useCourseStore } from '@/store/store';
  import SubmitAssignment from '@/pages/student/components/SubmitAssignment.vue';
  
  const courseStore = useCourseStore();
  const selectedTask = ref(null);
  
  // 获取待办和已完成的任务列表
  const pendingTasks = computed(() => courseStore.getPendingTasks());
  const completedTasks = computed(() => courseStore.getCompletedTasks());
  
  // 显示提交作业表单
  const showAssignmentForm = (task) => {
    selectedTask.value = task;
  };
  
  // 关闭模态框
  const closeModal = () => {
    selectedTask.value = null;
  };
  </script>
  
  <style scoped>
  .todo-list-container {
    padding: 20px;
  }
  
  .page-header {
    margin-bottom: 20px;
  }
  
  .task-section {
    margin-bottom: 20px;
  }
  
  .task-list {
    list-style-type: none;
    padding: 0;
  }
  
  .task-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  
  .task-item .badge {
    color: #fff;
    background-color: #007bff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.875em;
  }
  
  .task-item .text-success {
    color: green;
  }
  
  .no-tasks {
    color: #6c757d;
    font-style: italic;
  }
  
  .btn {
    margin-left: 10px;
  }
  </style>