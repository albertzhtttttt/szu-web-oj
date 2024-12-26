<template>
  <div class="wrap">
    <!-- 如果是老师，显示添加课程按钮 -->
    <div v-if="isTeacher">
      <el-button class="add-course-button" @click="showAddCourseForm = true">
        添加课程
      </el-button>
    </div>

    <div>
      <el-text>课程分类：</el-text>
      <el-space>
        <el-button
            :type="currentCategory === 'all' ? 'primary' : 'info'"
            link
            @click="setCategory('all')"
        >
          全部
        </el-button>
        <el-button
            :type="currentCategory === 'lixue' ? 'primary' : 'info'"
            link
            @click="setCategory('lixue')"
        >
          理学·工学
        </el-button>
        <el-button
            :type="currentCategory === 'jisuan' ? 'primary' : 'info'"
            link
            @click="setCategory('jisuan')"
        >
          计算机
        </el-button>
        <el-button
            :type="currentCategory === 'wenxue' ? 'primary' : 'info'"
            link
            @click="setCategory('wenxue')"
        >
          文学·艺术
        </el-button>
      </el-space>
    </div>

    <div>
      <el-text>供课院校：</el-text>
      <el-space>
        <el-button
            :type="currentCollege === 'all' ? 'primary' : 'info'"
            link
            @click="setCollege('all')"
        >
          全部
        </el-button>
        <el-button
            :type="currentCollege === 'szu' ? 'primary' : 'info'"
            link
            @click="setCollege('szu')"
        >
          深圳大学
        </el-button>
        <el-button
            :type="currentCollege === 'hubei' ? 'primary' : 'info'"
            link
            @click="setCollege('hubei')"
        >
          湖北大学
        </el-button>
      </el-space>
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="综合排序" name="com"></el-tab-pane>
      <el-tab-pane label="最新" name="new">Config</el-tab-pane>
      <el-tab-pane label="最热" name="hot">Role</el-tab-pane>
    </el-tabs>

    <div v-for="(course, index) in courses" :key="index" style="margin-bottom: 20px;">
      <course-item :course="course" />
      <div v-if="isTeacher">
        <el-button type="danger" @click="deleteCourse(index)">删除课程</el-button>
      </div>
    </div>

    <!-- 新课程添加表单 -->
    <div v-if="showAddCourseForm" class="add-course-form">
      <el-form :model="newCourse" label-width="80px">
        <el-form-item label="课程名称">
          <el-input v-model="newCourse.name" placeholder="请输入课程名称"></el-input>
        </el-form-item>

        <el-form-item label="教师">
          <el-input v-model="newCourse.teacher" placeholder="请输入教师名称"></el-input>
        </el-form-item>

        <el-form-item label="课程状态">
          <el-input v-model="newCourse.status" placeholder="请输入课程状态"></el-input>
        </el-form-item>

        <el-form-item label="课程简介">
          <el-input v-model="newCourse.info" placeholder="请输入课程简介" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="课程图片">
          <el-input v-model="newCourse.image" placeholder="请输入课程图片链接"></el-input>
        </el-form-item>
      </el-form>

      <div class="form-footer">
        <el-button @click="cancelAddCourse">取消</el-button>
        <el-button type="primary" @click="addNewCourse">确认</el-button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useCourseStore } from '/src/store/store.js'
import { useUserStore } from '/src/store/user.js' // 引入 user store
import CourseItem from "@/pages/home/components/CourseItem.vue"

// 定义状态
const activeName = ref('com')
const currentCategory = ref('all')
const currentCollege = ref('all')
const showAddCourseForm = ref(false) // 控制表单显示
const newCourse = ref({
  image: '',
  name: '',
  teacher: '',
  status: '',
  info: ''
})

const courseStore = useCourseStore()
const userStore = useUserStore() // 引入 userStore

const handleClick = (tab, event) => {
  console.log(tab, event)
}

const setCategory = (category) => {
  currentCategory.value = category
}
const setCollege = (college) => {
  currentCollege.value = college
}

onMounted(() => {
  courseStore.loadCourses()
})

const courses = computed(() => courseStore.courses)

// 假设 isTeacher 从服务器或存储中获取，以下为模拟标志
const isTeacher = computed(() => userStore.isTeacher) // 使用 isTeacher getter

// 显示添加课程表单
const openAddCourseForm = () => {
  showAddCourseForm.value = true
}

// 取消添加课程，隐藏表单
const cancelAddCourse = () => {
  showAddCourseForm.value = false
  resetForm()
}

// 重置表单数据
const resetForm = () => {
  newCourse.value = {
    image: '',
    name: '',
    teacher: '',
    status: '',
    info: ''
  }
}

// 添加新课程
const addNewCourse = () => {
  // 确保所有字段都填写了
  if (!newCourse.value.name || !newCourse.value.teacher || !newCourse.value.status || !newCourse.value.info || !newCourse.value.image) {
    alert('请填写所有字段')
    return
  }

  // 调用 store 中的 addCourse 方法
  courseStore.addCourse({ ...newCourse.value })

  // 隐藏表单并重置数据
  cancelAddCourse()
}

// 删除课程
const deleteCourse = (index) => {
  courseStore.courses.splice(index, 1)  // 删除指定课程
  courseStore.saveCourses()            // 保存到 localStorage
}
</script>

<style scoped>
.wrap {
  display: flex;
  padding: 0 300px;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  position: relative; /* 使按钮能够定位 */
}

.add-course-form {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.form-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.add-course-button {
  position: absolute;
  bottom: 30px;  /* 将按钮放到底部 */
  left: 50%;
  transform: translateX(-50%);  /* 居中按钮 */
  font-size: 18px;  /* 放大字体 */
  padding: 15px 30px;  /* 增加按钮的内边距 */
  width: 200px;  /* 设置固定宽度 */
}
</style>
