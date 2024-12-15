<template>
  <div>
    <p>{{ course.name }}</p>
  </div>
</template>

<script setup>
import { useCourseStore } from '/src/store/store.js'

const courseStore = useCourseStore()

const course = courseStore.selectedCourse
</script>

<style scoped>

</style>