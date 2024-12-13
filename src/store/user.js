import {defineStore} from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        // 用户信息
        userRole: null,  // 角色：'admin' 或 'student' 或 'teacher'
        isAuthenticated: false,  // 是否已认证
    }),
    actions: {
        // 设置用户角色和认证状态
        setUserRole(role) {
            this.userRole = role
            this.isAuthenticated = true
        },
        // 登出，清除用户信息
        logout() {
            this.userRole = null
            this.isAuthenticated = false
        },
    },
    getters: {
        // 获取是否是管理员
        isAdmin: (state) => state.userRole === 'admin',
    },
})
