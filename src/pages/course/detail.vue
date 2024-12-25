<template>
  <div class="wrap">
      <div style="height: 270px;width: 480px;">
        <el-image src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" fit="cover"></el-image>
      </div>
    <p>{{ course.name }}</p>
    <p>{{ course }}</p>
  </div>
</template>

<script setup>
import {useCourseStore} from '/src/store/store.js'
import {computed} from "vue";

const courseStore = useCourseStore()

const course = computed(() => courseStore.selectedCourse)

</script>

<style scoped>
.wrap {
  display: flex;
  padding: 0 300px;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
}
</style>