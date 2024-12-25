import {createRouter, createWebHistory} from 'vue-router';
import {useUserStore} from '../store/user';  // 导入 store

// 路由配置
const routes = [
    // 默认重定向到 /home
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'homeIndex',
        component: () => import('../pages/home/index.vue'),
        meta: {requiresAuth: false},  // 不需要认证的路由
    },
    {
        path: '/course',
        name: 'courseIndex',
        component: () => import('../pages/course/index.vue'),
        meta: {requiresAuth: false},  // 不需要认证的路由
    },
    {
        path: '/course/detail',
        name: 'courseDetailIndex',
        component: () => import('../pages/courseDetail/index.vue'),
        meta: {requiresAuth: false},  // 不需要认证的路由
    },
    {
        path: '/college',
        name: 'collegeIndex',
        component: () => import('../pages/college/index.vue'),
        meta: {requiresAuth: false},  // 不需要认证的路由
    },
    {
        path: '/about',
        name: 'aboutIndex',
        component: () => import('../pages/about/index.vue'),
        meta: {requiresAuth: false},  // 不需要认证的路由
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),  // 使用 import.meta.env.BASE_URL 动态获取基础路径
    routes,
});

// 路由守卫：检查是否需要权限认证
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();  // 使用 store 获取用户认证信息
    const isAuthenticated = userStore.isAuthenticated;  // 假设你有一个 isAuthenticated 标志来判断是否已登录
    const userRole = userStore.userRole;  // 假设用户角色存储在 userRole 中

    // 如果目标路由需要认证
    if (to.meta.requiresAuth) {
        if (!isAuthenticated) {
            // 如果用户没有认证，跳转到首页或登录页面
            next('/home');  // 这里你可以设置为 `/login` 页面
        } else {
            // 认证通过，继续跳转
            next();
        }
    } else {
        // 如果目标路由不需要认证，直接跳转
        next();
    }
});

export default router;
