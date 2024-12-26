<template>
    <div class="my-tests">
        <h3>我的考试</h3>

        <!-- 待完成考试 -->
        <div class="pending-tests">
            <h4>待完成考试</h4>
            <div v-for="(exam, index) in pendingExams" :key="exam.id" class="exam-card pending">
                <div class="exam-info">
                    <p>{{ exam.name }}</p>
                    <span class="status pending-status">待完成</span>
                </div>
                <button @click="startExam(exam)" class="btn btn-primary">开始考试</button>
            </div>
        </div>

        <!-- 已完成考试 -->
        <div class="completed-tests">
            <h4>已完成考试</h4>
            <div v-for="(exam, index) in completedExams" :key="exam.id" class="exam-card completed">
                <div class="exam-info">
                    <p>{{ exam.name }}</p>
                    <span class="status completed-status">已完成</span>
                </div>
                <button @click="viewResult(exam)" class="btn btn-secondary">查看成绩</button>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            // 模拟待完成和已完成的考试数据
            pendingExams: [
                { id: 1, name: "数学考试" },
                { id: 2, name: "英语考试" },
            ],
            completedExams: [
                { id: 3, name: "历史考试", score: 95 },
                { id: 4, name: "物理考试", score: 88 },
            ],
        };
    },
    methods: {
        startExam(exam) {
            // 这里可以放置开始考试的逻辑
            alert(`开始考试：${exam.name}`);
        },
        viewResult(exam) {
            // 查看考试成绩
            alert(`查看考试成绩：${exam.name}，成绩：${exam.score}`);
        },
    },
};
</script>
  
<style scoped>
h3 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 20px;
}

.my-tests {
    padding: 20px;
}

.exam-card {
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.pending .exam-info {
    color: #ff6f61;
}

.completed .exam-info {
    color: #28a745;
}

.status {
    font-size: 14px;
    font-weight: bold;
}

.btn {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    cursor: pointer;
}

.pending-status {
    color: #ff6f61;
}

.completed-status {
    color: #28a745;
}
</style>
  