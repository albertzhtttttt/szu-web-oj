import {defineStore} from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        // 当前用户信息
        currentUser: null, // 当前登录用户
        isAuthenticated: false, // 是否已认证

        // 存储所有用户信息的数组
        users: [
            // 示例用户
            {username: 'admin', password: 'admin123', role: 'admin'},
            {username: 'student1', password: 'student123', role: 'student'},
            {username: 'teacher1', password: 'teacher123', role: 'teacher'}
        ],
    }),

    actions: {
        // 用户登录
        login(username, password) {
            // 查找是否有该用户
            const user = this.users.find(user => user.username === username && user.password === password);
            if (user) {
                this.currentUser = user;
                this.isAuthenticated = true;
            } else {
                this.isAuthenticated = false;
                console.log('用户名或密码错误');
            }
        },

        // 用户注册
        register(username, password, role) {
            // 判断用户名是否已存在
            const existingUser = this.users.find(user => user.username === username);
            if (existingUser) {
                console.log('该用户名已存在');
                return false;
            }
            // 创建新用户并添加到 users 数组
            const newUser = {username, password, role};
            this.users.push(newUser);
            console.log('注册成功');
            return true;
        },

        // 用户登出
        logout() {
            this.currentUser = null;
            this.isAuthenticated = false;
        },
    },

    getters: {
        // 获取是否是管理员
        isAdmin: (state) => state.currentUser?.role === 'admin',

        // 获取是否是学生
        isStudent: (state) => state.currentUser?.role === 'student',

        // 获取是否是教师
        isTeacher: (state) => state.currentUser?.role === 'teacher',
    },
});
