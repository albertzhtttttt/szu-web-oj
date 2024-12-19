<template>
  <div class="question-display">
    <h2>{{ currentQuestionSet.name }}</h2>

    <!-- 遍历题目集中的所有题目 -->
    <div v-for="question in currentQuestionSet.questions" :key="question.id" :class="['question-item', mode]">
      <h3>{{ question.question }}</h3>

      <!-- 根据题目类型渲染不同的输入方式 -->

      <!-- 单选题 -->
      <div v-if="question.type === 'single'">
        <div v-for="(option, index) in question.options" :key="index">
          <label>
            <input type="radio" :name="'question-' + question.id" :value="option" v-model="question.userAnswer"/>
            {{ option }}
          </label>
        </div>
      </div>

      <!-- 多选题 -->
      <div v-if="question.type === 'multi'">
        <div v-for="(option, index) in question.options" :key="index">
          <label>
            <input type="checkbox" :value="option" v-model="question.userAnswer"/>
            {{ option }}
          </label>
        </div>
      </div>

      <!-- 判断题 -->
      <div v-if="question.type === 'trueFalse'">
        <label>
          <input type="radio" :name="'question-' + question.id" value="正确" v-model="question.userAnswer"/>
          正确
        </label>
        <label>
          <input type="radio" :name="'question-' + question.id" value="错误" v-model="question.userAnswer"/>
          错误
        </label>
      </div>

      <!-- 简答题 -->
      <div v-if="question.type === 'shortAnswer'">
        <textarea v-model="question.userAnswer" placeholder="请输入你的答案..." :class="['shortAnswerInput', mode]"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionDisplay',
  props: {
    currentQuestionSet: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 可以在这里定义任何额外的本地状态或数据
      answeredQuestionIds:[],
    };
  },
  watch: {
    // 监听 questions 数组的变化，计算已答题的数量
    'currentQuestionSet.questions': {
      handler() {
        console.log("已答题ID:",this.answeredQuestionIds);
        const answeredCount = this.currentQuestionSet.questions.filter(question => {
          console.log("用户答题:",question.userAnswer);
          const isAnswered = this.checkAnswered(question);
          if (isAnswered && !this.answeredQuestionIds.includes(question.id)) {
            this.answeredQuestionIds.push(question.id);  // 如果题目已经回答，记录其 ID
          }
          else if (!isAnswered && this.answeredQuestionIds.includes(question.id)) {
            const index = this.answeredQuestionIds.indexOf(question.id);
            if (index !== -1) {
              this.answeredQuestionIds.splice(index, 1);  // 移除没有回答的题目 ID
            }
          }
          return isAnswered;
        }).length;

        // 发送已答题数量和已答题目 ID 到父组件
        this.$emit('updateAnsweredCount', answeredCount);
        this.$emit('updateAnsweredQuestionIds', this.answeredQuestionIds);
        //答题完应该存储在浏览器本地的currentQuestionSet.questions，而不是立马更新到index.vue（数据库）

      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    checkAnswered(question) {
      if (question.type === 'shortAnswer') {
        return question.userAnswer && question.userAnswer.trim().length > 0; // 简答题有输入
      }
      // 对于其他题目，判断是否有选择
      return Array.isArray(question.userAnswer) ? question.userAnswer.length > 0 : question.userAnswer !== null;
    }
  }
};
</script>

<style scoped>
.question-display {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}
.question-item.light {
  background-color: #fff;
  color: #333;
}

.question-item.dark {
  background-color: #333;
  color: #fff;
}

.question-display h2 {
  font-size: 26px;
  margin-bottom: 10px;
}

h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

label {
  display: block;
  margin: 8px 0;
}

.shortAnswerInput {
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.shortAnswerInput.light {
}
.shortAnswerInput.dark {
  background-color: #333;
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
input[type="radio"], input[type="checkbox"] {
  margin-right: 10px;
}
</style>
