<!-- src/components/Login.vue -->
<template>
    <div>
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="handleLogin">Login</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      handleLogin() {
        this.$store.dispatch('login', {
          username: this.username,
          password: this.password
        }).then(() => {
          this.$router.push('/home') // 登录成功后跳转
        })
      }
    }
  }
  </script>
  