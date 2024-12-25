<template>
  <div class="wrap">
    <div style="height: 270px;width: 480px;">
      <el-image :src="imagePath"></el-image>
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
// 使用计算属性来动态处理图片路径
const imagePath = computed(() => {
  if (course && course.image) {
    // 使用 require 来处理图片路径
    return require(`@/assets/${course.image.substring(4)}`) // 去掉 'src/' 前缀并使用 require 处理路径
  }
  return require('@/assets/default-image.png') // 如果没有图片路径，返回默认图片
})
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