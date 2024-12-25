<!-- src/pages/student/myCourses.vue -->
<template>
    <div class="my-courses">
      <header class="page-header">
        <h1>我的课程</h1>
        <p>在这里您可以查看和管理您的课程及学习任务。</p>
      </header>
  
      <section v-if="selectedCourse && selectedCourse.tasks && selectedCourse.tasks.length > 0" class="task-list">
        <h2>{{ selectedCourse.name }} 的学习任务</h2>
        <ul class="list-group">
          <li v-for="task in selectedCourse.tasks" :key="task.id" class="list-group-item d-flex justify-content-between align-items-center">
            <span>{{ task.description }}</span>
            <span class="badge bg-primary rounded-pill">{{ task.type }}</span>
            <button v-if="task.type === '提交作业'" @click="showAssignmentForm(task)" class="btn btn-sm btn-outline-primary ms-2">提交</button>
          </li>
        </ul>
      </section>
  
      <SubmitAssignment v-if="showModal" @close="closeModal" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useCourseStore } from '@/store/store';  // 导入 store
  import SubmitAssignment from '@/pages/student/components/SubmitAssignment.vue';
  
  const route = useRoute();
  const courseId = parseInt(route.params.id);
  const courseStore = useCourseStore();
  const showModal = ref(false);
  const selectedCourse = computed(() => courseStore.getCourseById(courseId));
  
  // 显示提交作业表单
  const showAssignmentForm = (task) => {
    showModal.value = true;
  };
  
  // 关闭模态框
  const closeModal = () => {
    showModal.value = false;
  };
  </script>
  
  <style scoped>
  .my-courses {
    padding: 20px;
    min-height: 100vh;
    background-color: var(--color-background);
    color: var(--color-text);
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
    color: var(--color-heading);
  }
  
  .page-header p {
    font-size: 1.25rem;
    color: var(--color-text);
  }
  
  .course-list,
  .task-list {
    margin-bottom: 2rem;
  }
  
  .card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
  }
  
  .card:hover {
    transform: translateY(-5px);
  }
  
  .card img {
    height: 200px;
    object-fit: cover;
  }
  
  .card a.btn {
    width: 100%;
  }
  
  .no-courses {
    text-align: center;
    padding: 2rem;
  }
  
  .list-group-item {
    border-radius: 8px;
    margin-bottom: 8px;
  }
  
  .badge {
    font-size: 0.8em;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal .modal-dialog {
    background-color: white;
    border-radius: 8px;
    padding: 2rem;
    max-width: 500px;
    width: 100%;
  }
  
  .modal .modal-header,
  .modal .modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal .modal-header h3 {
    margin: 0;
  }
  
  .modal .modal-footer button {
    margin-left: 0.5rem;
  }
  </style>