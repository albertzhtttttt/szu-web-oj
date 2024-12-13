<template>
  <div class="common-layout">
    <Header/>
    <router-view/>
  </div>
</template>
<script setup>
import Header from "@/components/Header.vue"
</script>

<style scoped>
.common-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
}
</style>
