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
        <li v-for="(course, index) in courses" :key="course.name" class="course-item">
          {{ course.name }}
          <button @click="deleteCourse(course.name)" class="delete-button">删除</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const courseName = ref('');
const isSubmitting = ref(false);
const courses = ref([]);

// 获取课程列表
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
    // 添加新课程
    await axios.post('http://localhost:5000/api/courses', { name: courseName.value });
    alert('课程添加成功');
    
    // 重新获取课程列表
    const response = await axios.get('http://localhost:5000/api/courses');
    courses.value = response.data;
  } catch (error) {
    alert('添加课程失败');
    console.error('添加课程失败', error);
  } finally {
    isSubmitting.value = false;
  }
};

// 删除课程
const deleteCourse = async (name) => {
  if (confirm(`确定要删除此课程吗？课程名称: ${name}`))  { // 添加确认删除的提示框
    try {
      await axios.delete(`http://localhost:5000/api/courses/${name}`);
      alert('课程删除成功');
      
      // 重新获取课程列表
      const response = await axios.get('http://localhost:5000/api/courses');
      courses.value = response.data;
    } catch (error) {
      alert('出错啦！删除课程失败');
      console.error('删除失败:', error);
    }
  }
};
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
  color: #333;
}

.course-item {
  background-color: #fff;
  color: #333;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.course-item:hover {
  background-color: #f0f0f0;
}

.delete-button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 14px;
}

.delete-button:hover {
  background-color: #d32f2f;
}
</style>
  