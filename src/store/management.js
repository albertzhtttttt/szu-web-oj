import { defineStore } from 'pinia';
import { getAllManagementInfo } from '@/pages/user/utils/api.js';
import { ElMessage } from "element-plus";

const roleMap = {
    student: '学生',
    admin: '管理员',
    teacher: '教师'
};
const statusMap = {
    0: '禁用',
    1: '启用'
};

export const useManagementStore = defineStore('management', {
    state: () => ({
        managementData: []  // 初始化为空数组
    }),
    actions: {
        async fetchManagementData() {
            try {
                let data = await getAllManagementInfo();
                data = data.map(item => ({
                    ...item,
                    role: roleMap[item.role] || item.role,
                    status: statusMap[item.status] || item.status
                }));
                console.log(data)
                this.managementData = data;  // 更新 store 状态
            } catch (error) {
                ElMessage.error('获取管理信息失败');
                console.error(error);
            }
        },
        deleteStudent(uid) {
            this.managementData = this.managementData.filter(student => student.uid !== uid);
        }

    },
    getters: {
        getData: (state) => state.managementData
    }
});
