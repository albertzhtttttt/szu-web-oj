<template>
  <div class="add-course-container">
    <h1>添加课程</h1>
    <form @submit.prevent="handleSubmit" class="course-form">
      <label for="courseName" class="form-label">课程名称:</label>
      <input v-model="courseName" type="text" id="courseName" required class="form-input"/>
      <button type="submit" :disabled="isSubmitting">提交</button>
    </form>
    
    <div v-if="courses.length > 0" class="course-list">
      <h2>现有课程</h2>
      <ul>
        <li v-for="(course, index) in courses" :key="index" class="course-item">
          {{ course.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const courseName = ref('');
const isSubmitting = ref(false);
const courses = ref([]);
const router = useRouter();

// 获取课程列表并处理路由问题
// 修改 axios 请求，连接到本地服务器
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/courses');
    courses.value = response.data;
  } catch (error) {
    console.error("获取课程列表失败", error);
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await axios.post('http://localhost:5000/api/courses', { name: courseName.value });
    alert('课程添加成功');
    const response = await axios.get('http://localhost:5000/api/courses');
    courses.value = response.data;
    courseName.value = ''; // 清空输入框
  } catch (error) {
    alert('添加课程失败');
  } finally {
    isSubmitting.value = false;
  }
};


// 防止表单在路由切换过程中丢失
watch(courses, () => {
  localStorage.setItem('courseName', courseName.value);
});

router.beforeEach((to, from, next) => {
  if (to.path === '/add-course') {
    // 恢复表单状态
    courseName.value = localStorage.getItem('courseName') || '';
  }
  next();
});
</script>

<style scoped>
.add-course-container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.course-form {
  margin-bottom: 30px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.submit-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.course-list {
  margin-top: 30px;
}

.course-list h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.course-item {
  background-color: #fff;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.course-item:hover {
  background-color: #f0f0f0;
}
</style>
