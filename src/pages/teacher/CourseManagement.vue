<template>
  <div class="course-management">
    <h1>课程管理</h1>

    <!-- 课程列表 -->
    <div v-for="(course, courseIndex) in courses" :key="courseIndex" class="course">
      <h2>{{ course.name }}</h2>

      <!-- 单元列表 -->
      <div v-for="(unit, unitIndex) in course.units" :key="unitIndex" class="unit">
        <h3>{{ unit.name }}</h3>

        <!-- 单元中的问题列表 -->
        <ul>
          <li v-for="(question, questionIndex) in unit.questions" :key="question.id">
            <span>{{ question.question }}</span>
            <button @click="deleteQuestion(course.name, unit.name, question.id)">删除问题</button>
          </li>
        </ul>

        <!-- 增加问题 -->
        <div>
          <input v-model="newQuestion" placeholder="输入新问题" />
          <button @click="addQuestion(course.name, unit.name)">添加问题</button>
        </div>

        <button @click="deleteUnit(course.name, unit.name)">删除单元</button>
      </div>

      <!-- 增加单元 -->
      <div>
        <input v-model="newUnit" placeholder="输入新单元名" />
        <button @click="addUnit(course.name)">添加单元</button>
      </div>

      <hr />
    </div>

    <!-- 增加课程 -->
    <div>
      <input v-model="newCourse" placeholder="输入新课程名" />
      <button @click="addCourse">添加课程</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      courses: [], // 存储课程数据
      newCourse: '', // 新课程名称
      newUnit: '', // 新单元名称
      newQuestion: '', // 新问题内容
    };
  },
  created() {
    this.fetchCourses();
  },
  methods: {
    // 获取课程数据
    async fetchCourses() {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        this.courses = response.data;
      } catch (error) {
        console.error('获取课程数据失败:', error);
      }
    },

    // 添加课程
    async addCourse() {
      if (!this.newCourse) {
        alert('课程名称不能为空');
        return;
      }
      try {
        await axios.post('http://localhost:5000/api/courses', { name: this.newCourse });
        this.newCourse = ''; // 清空输入框
        this.fetchCourses(); // 刷新课程列表
      } catch (error) {
        console.error('添加课程失败:', error);
      }
    },

    // 删除课程
    async deleteCourse(courseName) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${courseName}`);
        this.fetchCourses(); // 刷新课程列表
      } catch (error) {
        console.error('删除课程失败:', error);
      }
    },

    // 添加单元
    async addUnit(courseName) {
      if (!this.newUnit) {
        alert('单元名称不能为空');
        return;
      }
      try {
        await axios.post(`http://localhost:5000/api/courses/${courseName}/units`, { name: this.newUnit });
        this.newUnit = ''; // 清空输入框
        this.fetchCourses(); // 刷新课程列表
      } catch (error) {
        console.error('添加单元失败:', error);
      }
    },

    // 删除单元
    async deleteUnit(courseName, unitName) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${courseName}/units/${unitName}`);
        this.fetchCourses(); // 刷新课程列表
      } catch (error) {
        console.error('删除单元失败:', error);
      }
    },

    // 添加问题
    async addQuestion(courseName, unitName) {
      if (!this.newQuestion) {
        alert('问题内容不能为空');
        return;
      }
      try {
        await axios.post(`http://localhost:5000/api/courses/${courseName}/units/${unitName}/questions`, {
          question: this.newQuestion,
        });
        this.newQuestion = ''; // 清空输入框
        this.fetchCourses(); // 刷新课程列表
      } catch (error) {
        console.error('添加问题失败:', error);
      }
    },

    // 删除问题
    async deleteQuestion(courseName, unitName, questionId) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${courseName}/units/${unitName}/questions/${questionId}`);
        this.fetchCourses(); // 刷新课程列表
      } catch (error) {
        console.error('删除问题失败:', error);
      }
    },
  },
};
</script>

<style scoped>
.course-management {
  padding: 20px;
  font-family: Arial, sans-serif; /* 使用清晰易读的字体 */
}

.course {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #007bff;
  border-radius: 8px;
  background-color: #e6f7ff; /* 课程背景色 */
}

.course h2 {
  font-size: 24px;
  color: #0056b3; /* 课程标题颜色 */
}

.unit {
  margin-left: 20px;
  padding: 10px;
  border: 1px solid #007bff;
  border-radius: 6px;
  background-color: #cce4ff; /* 单元背景色 */
}

.unit h3 {
  font-size: 20px;
  color: #004085; /* 单元标题颜色 */
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

li span {
  color: #333; /* 问题文本颜色 */
}

button {
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #0056b3;
}

input {
  margin-right: 10px;
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input:focus {
  outline-color: #007bff;
}

hr {
  margin: 20px 0;
  border-top: 2px solid #007bff;
}

/* 增加课程、单元、问题的标题样式 */
h1 {
  font-size: 32px;
  color: #003366;
  text-align: center;
  margin-bottom: 20px;
}
</style>

