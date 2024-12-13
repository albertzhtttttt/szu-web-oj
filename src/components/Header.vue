<template>
  <div class="wrap">
    <el-space size="20px">
      <el-image style="width: 125px; height: 50px; margin-right: 20px; " src="src/assets/logo.png"></el-image>
      <el-button
          :type="currentRoute.path === '/home' ? 'primary' : 'info'"
          link
          @click="go('/home')"
      >
        首页
      </el-button>
      <el-button
          :type="currentRoute.path === '/course' ? 'primary' : 'info'"
          link
          @click="go('/course')"
      >
        课程
      </el-button>
      <el-button
          :type="currentRoute.path === '/college' ? 'primary' : 'info'"
          link
          @click="go('/college')"
      >
        联盟院校
      </el-button>
      <el-button
          :type="currentRoute.path === '/about' ? 'primary' : 'info'"
          link
          @click="go('/about')"
      >
        关于我们
      </el-button>
    </el-space>
    <el-space>
      <el-input v-model="input" style="width: 240px" placeholder="请输入课程/学校/主讲老师" />
    </el-space>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router'
import {ref} from "vue"

const router = useRouter()
const currentRoute = useRoute()
const input = ref('')
// 路由跳转
const go = (path) => router.push(path)
</script>


<style scoped>
.wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 300px;
  background-color: #ffffff;
  width: 100%;
  height: 80px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
</style>