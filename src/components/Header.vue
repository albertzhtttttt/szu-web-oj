<template>
  <div class="wrap">
    <el-space :size="20">
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
      <el-input v-model="searchInfo" style="width: 240px" placeholder="请输入课程/学校/主讲老师"/>
      <div v-if="userStore.isAuthenticated">
        <!-- 显示头像 -->
        <el-avatar>{{ userStore.currentUser?.username[0].toUpperCase() }}</el-avatar>
        <el-button type="primary" plain @click="logout">登出</el-button>
      </div>

      <div v-else>
        <!-- 显示登录和注册按钮 -->
        <el-button type="primary" plain @click="login">登录</el-button>
        <el-button type="primary" @click="go('/register')">注册</el-button>
      </div>
    </el-space>
  </div>
  <el-dialog v-model="visible" width="20%" :show-close="false">
    <div style="padding: 20px; display: flex; justify-content: center; flex-direction: column; gap: 10px;">
      <el-form :model="userForm" label-width="auto" style="max-width: 600px" ref="userFormRef">
        <el-form-item label="账号" prop="username" :rules="[{required: true, message: '请输入用户名！'}]">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="[{required: true, message: '请输入密码！'}]">
          <el-input v-model="userForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="onConfirm">登录</el-button>
      <el-text>使用第三方账号直接登录</el-text>
      <div style="display: flex; justify-content: center;">
        <el-image src="src/assets/qq.png" style="width: 64px; height: 42px;" draggable="false"></el-image>
        <el-image src="src/assets/wx.png" style="width: 64px; height: 42px;" draggable="false"></el-image>
        <el-image src="src/assets/wb.png" style="width: 64px; height: 42px;" draggable="false"></el-image>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router'
import {reactive, ref} from "vue"
import {useUserStore} from '/src/store/user.js'
import {ElMessage} from "element-plus";

const router = useRouter()
const currentRoute = useRoute()
const userStore = useUserStore()
const visible = ref(false)
const searchInfo = ref('')
const userForm = reactive({
  username: '',
  password: '',
})
const userFormRef = ref(null)
// 路由跳转
const go = (path) => router.push(path)
const login = () => {
  visible.value = true
}
const onConfirm = () => {
  if (userFormRef.value) {
    userFormRef.value.validate((valid) => {
      if (valid) {
        userStore.login(userForm.username, userForm.password)
        if (userStore.isAuthenticated) {
          ElMessage.success('登录成功！')
          visible.value = false;
        } else {
          ElMessage.error('用户名或密码错误')
        }
      } else {
        ElMessage.warning('请输入正确的用户名和密码')
      }
    });
  }
}
const logout = () => {
  userStore.logout()
  ElMessage.success('登出成功！')
  router.push('/home'); // 跳转到主界面
}
</script>


<style scoped>
.wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 300px;
  background-color: #ffffff;
  width: 100%;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid #ddd;
}
</style>