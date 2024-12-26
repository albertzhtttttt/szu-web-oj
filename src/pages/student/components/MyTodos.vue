<template>
  <div class="my-todos">
    <h3>待办事项</h3>

    <!-- 已完成事项 -->
    <div class="completed-tasks">
      <h4>已完成</h4>
      <div v-for="(task, index) in completedTasks" :key="task.id" class="task-card completed">
        <div class="task-info">
          <p>{{ task.name }}</p>
          <span class="status completed-status">已完成</span>
        </div>
        <button @click="viewAssignment(task)" class="btn btn-secondary">查看作业</button>
      </div>
    </div>

    <!-- 未完成事项 -->
    <div class="pending-tasks">
      <h4>未完成</h4>
      <div v-for="(task, index) in pendingTasks" :key="task.id" class="task-card pending">
        <div class="task-info">
          <p>{{ task.name }}</p>
          <span class="status pending-status">未完成</span>
        </div>
        <button @click="openSubmitDialog(task)" class="btn btn-primary">提交作业</button>
      </div>
    </div>

    <!-- 提交作业组件 -->
    <SubmitAssignment
      v-if="showSubmitDialog"
      :task="currentTask"
      @close="closeSubmitDialog"
      @submit="handleTaskCompletion"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus'; // 引入 Element UI 的消息提示组件
import SubmitAssignment from './SubmitAssignment.vue';

const tasks = ref([
  { id: 1, name: '作业 1', completed: false },
  { id: 2, name: '作业 2', completed: false },
  { id: 3, name: '作业 3', completed: false },
  { id: 4, name: '作业 4', completed: false },
]);

// 计算属性，分别获取已完成和未完成的任务
const completedTasks = computed(() => tasks.value.filter(task => task.completed));
const pendingTasks = computed(() => tasks.value.filter(task => !task.completed));

// 控制提交作业对话框的显示
const showSubmitDialog = ref(false);
const currentTask = ref(null);

// 打开提交作业对话框
const openSubmitDialog = (task) => {
  showSubmitDialog.value = true;
  currentTask.value = task;
};

// 关闭提交作业对话框
const closeSubmitDialog = () => {
  showSubmitDialog.value = false;
};

// 提交作业后更新任务状态
const handleTaskCompletion = (assignmentData) => {
  // 更新任务的状态
  const task = currentTask.value;
  task.completed = true;  // 将任务标记为已完成
  
  // 弹出成功提示
  ElMessage.success('作业提交成功！');

  // 关闭提交作业对话框
  closeSubmitDialog();
};

// 查看作业功能
const viewAssignment = (task) => {
  // 这里可以根据需求进行查看作业的功能，比如打开一个新的页面或者显示详细内容
  ElMessage.info(`查看作业: ${task.name}`);
};
</script>


<style scoped>
.my-todos {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.task-card {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.completed {
  background-color: #e0e0e0;
}

.pending {
  background-color: #f8f9fa;
}

.task-info {
  display: flex;
  align-items: center;
}

.status {
  margin-left: 10px;
  font-size: 0.9rem;
  padding: 2px 6px;
  border-radius: 4px;
}

.completed-status {
  background-color: #28a745;
  color: white;
}

.pending-status {
  background-color: #ffc107;
  color: white;
}

button {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button.btn-secondary {
  background-color: #6c757d;
}
</style>
