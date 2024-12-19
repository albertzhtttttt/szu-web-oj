<template>
  <div class="container">
    <!-- 显示小方块的容器 -->
    <div class="question-ids-container">
      <!-- 遍历问题的 ID，生成小方块 -->
      <div
          v-for="(question, index) in currentQuestionSet.questions"
          :key="question.id"
          class="question-id-box"
          :class="{
            answered: answeredQuestionIds.includes(question.id),
            'not-answered': !answeredQuestionIds.includes(question.id)
          }"
      ></div>
    </div>
    <!-- 进度条 -->
    <div class="progress-bar">
      <div class="progress" :style="{ width: progressWidth + '%' }"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProgressBar',
  props: {
    currentQuestionSet: {
      type: Object,
      required: true
    },
    current: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    answeredQuestionIds:{
      type: Array,
      required: true
    }
  },
  computed: {
    progressWidth() {
      return (this.current / this.total) * 100;
    }
  },
  mounted() {
    console.log(this.currentQuestionSet); // 在组件挂载后打印 currentQuestionSet
  }
}
</script>

<style scoped>
/* 容器样式 */
.container {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center; /* 使子元素在主轴上居中对齐 */
  justify-content: center; /* 使子元素在交叉轴上居中对齐 */
}

.progress-bar {
  width: 100%;
  background-color: #eee;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

/* 小方块的样式 */
.question-ids-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 10px;
}

.question-id-box {
  width: 18px;
  height: 18px;
  background-color: #ddd; /* 默认灰色 */
  margin: 5px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

/* 答案已完成的样式 */
.question-id-box.answered {
  background-color: #4caf50; /* 绿色 */
}

.question-id-box.not-answered {
  background-color: #ddd; /* 默认灰色 */
}
</style>
