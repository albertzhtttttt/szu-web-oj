<template>
  <div class="wrap">
    <el-space :size="20">
      <el-image style="width: 125px; height: 50px; margin-right: 20px;" src="src/assets/logo.png"></el-image>
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
        <el-avatar style="margin-right: 20px;" @click="go('/user')">{{ userStore.currentUser?.username }}</el-avatar>
        <el-button type="primary" plain @click="logout">登出</el-button>
      </div>
      <div v-else>
        <el-button type="primary" plain @click="login">登录</el-button>
        <el-button type="primary" @click="register">注册</el-button>
      </div>
    </el-space>
  </div>

  <!-- 登录弹窗 -->
  <el-dialog v-model="visible" width="20%" :show-close="false">
    <div style="padding: 20px; display: flex; justify-content: center; flex-direction: column; gap: 10px;">
      <el-form :model="userForm" label-width="auto" style="max-width: 600px" ref="userFormRef">
        <el-form-item label="账号" prop="username" :rules="[{required: true, message: '请输入用户名！'}]">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="[{required: true, message: '请输入密码！'}]">
          <el-input v-model="userForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 5px;">
          <el-checkbox v-model="rememberMe">记住账号</el-checkbox>
          <el-button type="text" @click="forgotPassword" style="padding: 0;">忘记密码?</el-button>
        </div>
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

  <!-- 注册弹窗 -->
  <el-dialog v-model="registerVisible" width="20%" :show-close="false">
    <div style="padding: 20px; display: flex; justify-content: center; flex-direction: column; gap: 10px;">
      <el-form :model="registerForm" label-width="auto" style="max-width: 600px" ref="registerFormRef">
        <el-form-item label="角色" prop="role" :rules="[{required: true, message: '请选择角色！'}]">
          <el-radio-group v-model="registerForm.role">
            <el-radio label="student">学生</el-radio>
            <el-radio label="teacher">教师</el-radio>
            <el-radio label="admin">系统管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号" prop="username" :rules="[{required: true, message: '请输入用户名！'}]">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="[{required: true, message: '请输入密码！'}]">
          <el-input v-model="registerForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd" :rules="[{ required: true, message: '请确认密码！' }]">
          <el-input v-model="registerForm.confirmPwd" placeholder="请确认密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="agreePolicy">我同意《隐私政策》</el-checkbox>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="onRegisterConfirm" :disabled="!agreePolicy">注册</el-button>
    </div>
  </el-dialog>

  <!-- 忘记密码弹窗 -->
  <el-dialog v-model="forgotPasswordVisible" width="20%" :show-close="false">
    <div style="padding: 20px; display: flex; justify-content: center; flex-direction: column; gap: 10px;">
      <el-form :model="forgotPasswordForm" label-width="auto" style="max-width: 600px" ref="forgotPasswordFormRef">
        <el-form-item label="账号" prop="username" :rules="[{required: true, message: '请输入用户名！'}]">
          <el-input v-model="forgotPasswordForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword" :rules="[{required: true, message: '请输入新密码！'}]">
          <el-input v-model="forgotPasswordForm.newPassword" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="onResetPassword">重置密码</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router'
import {reactive, ref} from "vue"
import {useUserStore} from '/src/store/user.js'
import {ElMessage} from "element-plus"
import {registerValidateApi} from '@/pages/user/utils/api.js'

const router = useRouter()
const currentRoute = useRoute()
const userStore = useUserStore()
const visible = ref(false)
const registerVisible = ref(false)
const forgotPasswordVisible = ref(false)
const searchInfo = ref('')
const rememberMe = ref(false)
const agreePolicy = ref(false)
const userForm = reactive({username: 'rose', password: '123456'})
const registerForm = reactive({role: '', username: '', password: '', confirmPwd: ''})
const forgotPasswordForm = reactive({username: '', newPassword: ''})
const userFormRef = ref(null)
const registerFormRef = ref(null)
const forgotPasswordFormRef = ref(null)

const go = (path) => router.push(path)

const login = () => {
  visible.value = true
  // 如果记住账号，则自动填写
  const savedUsername = localStorage.getItem('username')
  if (savedUsername) {
    userForm.username = savedUsername
    rememberMe.value = true
  }
}

const register = () => {
  registerVisible.value = true
}

const onConfirm = () => {
  if (userFormRef.value) {
    userFormRef.value.validate(async (valid) => {
      if (valid) {
        await userStore.login(userForm)
        if (userStore.isAuthenticated) {
          if (rememberMe.value) {
            localStorage.setItem('username', userForm.username) // 保存用户名
          }
          ElMessage.success('登录成功！')
          visible.value = false
        }
      }
    })
  }
}

const onRegisterConfirm = () => {
  if (registerFormRef.value) {
    registerFormRef.value.validate(async (valid) => {
      if (valid) {
        await userStore.register(registerForm)
        if (userStore.isAuthenticated) {
          ElMessage.success('注册成功！')
          registerVisible.value = false
        }
      }
    })
  }
}

const onResetPassword = () => {
  if (forgotPasswordFormRef.value) {
    forgotPasswordFormRef.value.validate(async (valid) => {
      if (valid) {
        // 调用重置密码API
        ElMessage.success('密码重置成功！')
        forgotPasswordVisible.value = false
      }
    })
  }
}

const forgotPassword = () => {
  forgotPasswordVisible.value = true
}

const logout = () => {
  userStore.logout()
  localStorage.removeItem('username')
  go('/home')
  ElMessage.success('登出成功！')
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
