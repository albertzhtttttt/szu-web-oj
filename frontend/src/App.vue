<template>
   <div class="common-layout">
    <nav v-if="isTeacher" class="teacher-menu">
      <button @click="goToAddCourse">添加课程</button>
      <button @click="goToCheckGrades">查看成绩</button>
    </nav>
    <Header />
    <div>
      <router-view />
    </div>
    <Footer />
  </div>
</template>
<script setup>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import { computed } from "vue";
import { useUserStore } from "@/store/user"; // 确保路径正确
import { useRouter } from "vue-router"; // 引入 vue-router
const userStore = useUserStore();
const router = useRouter();
const isTeacher = computed(() => userStore.isTeacher);
// 跳转到添加课程页面
const goToAddCourse = () => {
  router.push("/add-course"); // 使用 vue-router 跳转
};

// 跳转到查看成绩页面
const goToCheckGrades = () => {
  router.push("/check-grades");
};
</script>
<style scoped>
.common-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  background-color: #f1f5fa;
  overflow-y: auto;
}
.teacher-menu {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.teacher-menu button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.teacher-menu button:hover {
  background-color: #0056b3;
}
</style>
