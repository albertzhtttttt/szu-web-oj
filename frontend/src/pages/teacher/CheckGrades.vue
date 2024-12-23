<template>
  <div class="check-grades-container">
    <h1>查看成绩</h1>
    
    <form @submit.prevent="handleSubmit" class="grade-form">
      <label for="studentName" class="form-label">学生姓名:</label>
      <input v-model="studentName" type="text" id="studentName" required class="form-input"/>
      
      <label for="courseName" class="form-label">课程名称:</label>
      <input v-model="courseName" type="text" id="courseName" required class="form-input"/>
      
      <label for="grade" class="form-label">成绩:</label>
      <input v-model="grade" type="number" id="grade" required class="form-input" min="0" max="100"/>
      
      <button type="submit" :disabled="isSubmitting">提交</button>
    </form>
    
    <div v-if="grades.length > 0" class="grades-list">
      <h2>成绩列表</h2>
      <ul>
        <li v-for="(grade, index) in grades" :key="index" class="grade-item">
          {{ grade.student }} - {{ grade.course }}: {{ grade.grade }}
          <button @click="deleteGrade(grade.student, grade.course)" class="delete-button">删除</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const studentName = ref('');
const courseName = ref('');
const grade = ref('');
const isSubmitting = ref(false);
const grades = ref([]);

// 获取成绩列表
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/grades');
    grades.value = response.data;
  } catch (error) {
    console.error("获取成绩列表失败", error);
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // 添加成绩
    await axios.post('http://localhost:5000/api/grades', { student: studentName.value, course: courseName.value, grade: grade.value });
    alert('成绩添加成功');
    
    // 重新获取成绩列表
    const response = await axios.get('http://localhost:5000/api/grades');
    grades.value = response.data;
  } catch (error) {
    alert('添加成绩失败');
    console.error('添加成绩失败', error);
  } finally {
    isSubmitting.value = false;
  }
};

// 删除成绩
const deleteGrade = async (student, course) => {
  if (confirm(`确定要删除此成绩吗？学生: ${student}，课程: ${course}`)) {
    try {
      await axios.delete(`http://localhost:5000/api/grades/${student}/${course}`);
      alert('成绩删除成功');
      
      // 重新获取成绩列表
      const response = await axios.get('http://localhost:5000/api/grades');
      grades.value = response.data;
    } catch (error) {
      alert('删除成绩失败');
      console.error('删除成绩失败', error);
    }
  }
};
</script>

<style scoped>
.check-grades-container {
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

.grade-form {
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

.grades-list {
  margin-top: 30px;
}

.grades-list h2 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.grade-item {
  background-color: #fff;
  color: #333;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.grade-item:hover {
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
