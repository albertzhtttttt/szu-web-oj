<template>
  <div>
    <h1>学生成绩</h1>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">
      <p>加载中...</p>
    </div>
    
    <!-- 无数据状态 -->
    <div v-if="!isLoading && students.length === 0" class="no-data">
      <p>没有找到任何成绩数据。</p>
    </div>

    <!-- 成绩表格 -->
    <table v-if="!isLoading && students.length > 0">
      <thead>
        <tr>
          <th>学生姓名</th>
          <th>成绩</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.name }}</td>
          <td>{{ student.grade }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      students: [],  // 存储学生数据
      isLoading: true,  // 加载状态
    };
  },
  mounted() {
    // 页面加载时请求成绩数据
    this.fetchGrades();
  },
  methods: {
    async fetchGrades() {
      try {
        const response = await axios.get('/api/grades', {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`, // 使用存储的 token
          },
        });
        this.students = response.data; // 更新学生数据
      } catch (error) {
        console.error("获取数据失败", error);
        alert("加载成绩数据失败，请稍后再试");
      } finally {
        this.isLoading = false; // 数据请求完成，关闭加载状态
      }
    },
  },
};
</script>

<style scoped>
/* 页面样式 */
.loading {
  text-align: center;
  font-size: 20px;
  color: #999;
}

.no-data {
  text-align: center;
  font-size: 18px;
  color: #999;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}
</style>
