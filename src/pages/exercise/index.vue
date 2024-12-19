<template>
  <div :class="['wrap', mode]">
    <div class="content">
      <!-- 左侧进度概览 -->
      <div class="left">
        <ProgressBar
            :current="answeredCount"
            :currentQuestionSet="currentQuestionSet"
            :total="currentQuestionSet.questions.length"
            :answeredQuestionIds="answeredQuestionIds"
        />
      </div>

      <!-- 中间答题区域 -->
      <div class="center">
        <QuestionDisplay
            :mode="mode"
            :currentQuestionSet="currentQuestionSet"
            @updateAnsweredCount="updateAnsweredCount"
            @updateAnsweredQuestionIds="updateAnsweredQuestionIds"
        />
      </div>

      <!-- 右侧题目列表 -->
      <div class="right">
        <QuestionList :mode="mode" :questionSets="questionSets" @selectQuestionSet="goToQuestion" />
      </div>

      <!-- LLM聊天窗口悬浮 -->
      <div class="chatbot">
        <Chatbot :mode="mode"/>
      </div>

      <!-- 模式切换 -->
      <div class="mode-switch" @click="toggleMode">
        <span>{{ mode === 'dark' ? '切换到白天模式' : '切换到黑夜模式' }}</span>
      </div>
    </div>

    <!-- 创建新题目集 -->
    <div class="floating-button" @click="showModal = !showModal">
      +
    </div>

    <!-- 创建新题目集设置框 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>生成题目集</h3>
        <label>单选题数量：</label>
        <input type="number" v-model="form.singleChoice" min="0">
        <label>多选题数量：</label>
        <input type="number" v-model="form.multiChoice" min="0">
        <label>判断题数量：</label>
        <input type="number" v-model="form.trueFalse" min="0">
        <label>简答题数量：</label>
        <input type="number" v-model="form.shortAnswer" min="0">
        <label>选项随机排列：</label>
        <select v-model="form.shuffleOptions">
          <option value="no">否</option>
          <option value="yes">是</option>
        </select>
        <button @click="generateQuestions">确认生成</button>
        <button @click="showModal = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from './components/ProgressBar.vue'
import QuestionDisplay from './components/QuestionDisplay.vue'
import QuestionList from './components/QuestionList.vue'
import Chatbot from './components/Chatbot.vue'

export default {
  name: 'exercise',
  components: {
    ProgressBar,
    QuestionDisplay,
    QuestionList,
    Chatbot
  },
  data() {
    return {
      mode: 'light',// 模式状态
      questionBank: [
        // 定义一个题库，所有的题目类型都在这里面
        { "id": 1, "type": "single", "question": "地球是太阳系的第几颗行星？", "options": ["第一", "第二", "第三"], "answer": "第三", "userAnswer": null },
        { "id": 2, "type": "multi", "question": "以下哪些是联合国安全理事会常任理事国？", "options": ["中国", "法国", "德国", "俄罗斯", "美国"], "answer": ["中国", "法国", "俄罗斯", "美国"], "userAnswer": [] },
        { "id": 3, "type": "trueFalse", "question": "水的化学式是H2O。", "options": ["正确", "错误"], "answer": "正确", "userAnswer": null },
        { "id": 4, "type": "shortAnswer", "question": "请解释牛顿第三定律。", "answer": "作用力和反作用力大小相等，方向相反。", "userAnswer": null },
        { "id": 5, "type": "single", "question": "世界上最高的山峰是什么？", "options": ["珠穆朗玛峰", "乞力马扎罗山", "麦金利山"], "answer": "珠穆朗玛峰", "userAnswer": null },
        { "id": 6, "type": "multi", "question": "以下哪些是哺乳动物？", "options": ["海豚", "鲨鱼", "蝙蝠", "鳄鱼"], "answer": ["海豚", "蝙蝠"], "userAnswer": [] },
        { "id": 7, "type": "trueFalse", "question": "光年是时间单位。", "options": ["正确", "错误"], "answer": "错误", "userAnswer": null },
        { "id": 8, "type": "shortAnswer", "question": "描述一下什么是温室效应。", "answer": "温室效应是指地球大气层中的温室气体对太阳辐射的吸收和反射作用，导致地球表面温度升高的现象。", "userAnswer": null },
        { "id": 9, "type": "single", "question": "人类的DNA由多少对染色体组成？", "options": ["22", "23", "24"], "answer": "23", "userAnswer": null },
        { "id": 10, "type": "multi", "question": "以下哪些是人体必需的微量元素？", "options": ["铁", "钙", "锌", "钠"], "answer": ["铁", "锌"], "userAnswer": [] },
        { "id": 11, "type": "trueFalse", "question": "维生素C是人体必需的维生素之一。", "options": ["正确", "错误"], "answer": "正确", "userAnswer": null },
        { "id": 12, "type": "shortAnswer", "question": "请解释什么是光合作用。", "answer": "光合作用是植物、藻类和某些细菌利用光能将二氧化碳和水转化为有机物和氧气的过程。", "userAnswer": null },
        { "id": 13, "type": "single", "question": "世界上最大的海洋是什么？", "options": ["太平洋", "大西洋", "印度洋", "北冰洋"], "answer": "太平洋", "userAnswer": null },
        { "id": 14, "type": "multi", "question": "以下哪些是计算机编程语言？", "options": ["Java", "C++", "Python", "SQL"], "answer": ["Java", "C++", "Python"], "userAnswer": [] },
        { "id": 15, "type": "trueFalse", "question": "二进制数1011等于十进制数11。", "options": ["正确", "错误"], "answer": "正确", "userAnswer": null },
        { "id": 16, "type": "shortAnswer", "question": "描述一下什么是相对论。", "answer": "相对论是爱因斯坦提出的描述物体高速运动和强引力场中物理现象的理论，包括狭义相对论和广义相对论。", "userAnswer": null },
        { "id": 17, "type": "single", "question": "人体最大的器官是什么？", "options": ["心脏", "肝脏", "皮肤", "肺"], "answer": "皮肤", "userAnswer": null },
        { "id": 18, "type": "multi", "question": "以下哪些是太阳系的行星？", "options": ["水星", "火星", "地球", "冥王星"], "answer": ["水星", "火星", "地球"], "userAnswer": [] },
        { "id": 19, "type": "trueFalse", "question": "DNA和RNA都是核酸。", "options": ["正确", "错误"], "answer": "正确", "userAnswer": null },
        { "id": 20, "type": "shortAnswer", "question": "请解释什么是生态系统。", "answer": "生态系统是由生物群落和其生存环境相互作用形成的一个统一整体。", "userAnswer": null },
        { "id": 21, "type": "single", "question": "世界上最长的河流是什么？", "options": ["尼罗河", "亚马逊河", "长江", "密西西比河"], "answer": "尼罗河", "userAnswer": null },
        { "id": 22, "type": "multi", "question": "以下哪些是哺乳动物的特征？", "options": ["哺乳", "卵生", "有毛发", "冷血"], "answer": ["哺乳", "有毛发"], "userAnswer": [] },
        { "id": 23, "type": "trueFalse", "question": "所有鸟类都能飞行。", "options": ["正确", "错误"], "answer": "错误", "userAnswer": null },
        { "id": 24, "type": "shortAnswer", "question": "描述一下什么是遗传学。", "answer": "遗传学是研究生物体遗传和变异规律的科学。", "userAnswer": null },
        { "id": 25, "type": "single", "question": "光速在真空中的速度是多少？", "options": ["299,792,458米/秒", "3.0 x 10^8米/秒", "7.9 x 10^6米/秒"], "answer": "299,792,458米/秒", "userAnswer": null },
        { "id": 26, "type": "multi", "question": "以下哪些是计算机硬件的组成部分？", "options": ["CPU", "GPU", "内存", "硬盘"], "answer": ["CPU", "GPU", "内存", "硬盘"], "userAnswer": [] },
        { "id": 27, "type": "trueFalse", "question": "人类的血液是红色的因为含有铁。", "options": ["正确", "错误"], "answer": "正确", "userAnswer": null },
        { "id": 28, "type": "shortAnswer", "question": "描述一下什么是细胞分裂。", "answer": "细胞分裂是细胞生命周期中的一个重要过程，通过这个过程，一个细胞分裂成两个或多个细胞。", "userAnswer": null },
        { "id": 29, "type": "single", "question": "人体最大的淋巴器官是什么？", "options": ["扁桃体", "脾脏", "胸腺", "阑尾"], "answer": "脾脏", "userAnswer": null }
      ],
      showModal: false, // 控制悬浮窗显示
      form: {
        singleChoice: 10, // 默认单选题数量
        multiChoice: 10, // 默认多选题数量
        trueFalse: 5, // 默认判断题数量
        shortAnswer: 1, // 默认简答题数量
        shuffleOptions: 'no' // 默认选项是否随机排列
      },
      questionSets: [
        {
          name: '基础知识测试',
          questions: [
            {id: 1, type: 'single', question: '你喜欢Vue吗？', options: ['是', '否'], answer: '是', userAnswer: null},
            {
              id: 2,
              type: 'multi',
              question: '你会哪些编程语言？',
              options: ['JavaScript', 'Python', 'C++', 'Java'],
              answer: ['JavaScript', 'Python'],
              userAnswer: []
            },
            {
              id: 3,
              type: 'trueFalse',
              question: 'Vue是一个前端框架',
              options: ['正确', '错误'],
              answer: '正确',
              userAnswer: null
            },
            {
              id: 4,
              type: 'shortAnswer',
              question: '描述一下什么是响应式编程',
              answer: '响应式编程是一种数据流驱动的编程范式。',
              userAnswer: null
            },
          ]
        },
        {
          name: '进阶知识测试',
          questions: [
            {id: 5, type: 'single', question: '你使用过Vuex吗？', options: ['是', '否'], answer: '是', userAnswer: null},
            {
              id: 6,
              type: 'multi',
              question: '以下哪些是常见的JavaScript框架？',
              options: ['React', 'Angular', 'Vue', 'Django'],
              answer: ['React', 'Angular', 'Vue'],
              userAnswer: []
            },
            {
              id: 7,
              type: 'trueFalse',
              question: 'React和Vue是两种完全不同的框架',
              options: ['正确', '错误'],
              answer: '错误',
              userAnswer: null
            },
            {
              id: 8,
              type: 'shortAnswer',
              question: '简述一下闭包的概念',
              answer: '闭包是函数和声明该函数的词法环境的组合。',
              userAnswer: null
            },
          ]
        },
        {
          name: '前端优化测试',
          questions: [
            {
              id: 9,
              type: 'single',
              question: 'React中如何处理状态管理？',
              options: ['Vuex', 'Redux', 'MobX', 'Context API'],
              answer: 'Redux',
              userAnswer: null
            },
            {
              id: 10,
              type: 'multi',
              question: '前端优化的常见策略有哪些？',
              options: ['懒加载', '图片压缩', '代码分割', '服务端渲染'],
              answer: ['懒加载', '代码分割'],
              userAnswer: []
            },
            {
              id: 11,
              type: 'trueFalse',
              question: '浏览器缓存能加速网站加载速度',
              options: ['正确', '错误'],
              answer: '正确',
              userAnswer: null
            },
            {
              id: 12,
              type: 'shortAnswer',
              question: '简述一下什么是图片懒加载',
              answer: '图片懒加载是一种延迟加载图片的技术，只有在图片进入可视区域时才加载。',
              userAnswer: null
            },
          ]
        }
      ],// 题目数据
      selectedSetIndex: 0,
      answeredCount:0,
      answeredQuestionIds:[],
    };
  },
  computed: {
    currentQuestionSet() {
      return this.questionSets[this.selectedSetIndex];
    }
  },
  methods: {
    goToQuestion(index) {
      this.selectedSetIndex = index;
      console.log(this.selectedSetIndex);
    },
    updateAnsweredCount(count) {
      this.answeredCount = count;
      console.log(`已答题数量：${this.answeredCount}`);
      console.log(`总数量：${this.currentQuestionSet.questions.length}`);
    },
    updateAnsweredQuestionIds(ids) {
      this.answeredQuestionIds = ids;
      console.log('已答题ID:', ids);
    },
    toggleMode() {
      this.mode = this.mode === 'light' ? 'dark' : 'light';
    },
    generateQuestions() {
      // 从题库中生成问题
      const selectedQuestions = [];
      const { singleChoice, multiChoice, trueFalse, shortAnswer, shuffleOptions } = this.form;
      // 筛选题目
      selectedQuestions.push(...this.getRandomQuestions('single', singleChoice, shuffleOptions === 'yes'));
      selectedQuestions.push(...this.getRandomQuestions('multi', multiChoice, shuffleOptions === 'yes'));
      selectedQuestions.push(...this.getRandomQuestions('trueFalse', trueFalse, shuffleOptions === 'yes'));
      selectedQuestions.push(...this.getRandomQuestions('shortAnswer', shortAnswer));
      // 生成新的题集
      this.questionSets.push({ name: '用户生成题集', questions: selectedQuestions });
      this.showModal = false; // 关闭弹窗
    },
    getRandomQuestions(type, quantity, shuffle = false) {
      // 获取指定数量的题目
      const filteredQuestions = this.questionBank.filter(q => q.type === type);
      const selected = [];
      // 随机选择题目
      for (let i = 0; i < quantity && filteredQuestions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
        selected.push(filteredQuestions.splice(randomIndex, 1)[0]);
      }
      // 如果需要随机打乱选项
      if (shuffle) {
        selected.forEach(q => {
          if (q.options && Array.isArray(q.options)) {
            q.options = this.shuffleArray(q.options);
          }
        });
      }
      return selected;
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 交换元素
      }
      return array;
    }
  }
}

</script>

<style scoped>
/* 页面全局样式 */
.wrap {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  font-family: Arial, sans-serif;
  transition: background-color 0.3s, color 0.3s;
}

/* 根据模式切换背景色 */
.wrap.light {
  background-color: #fff;
  color: #333;
}

.wrap.dark {
  background-color: #333;
  color: #fff;
}

/* 内容区域 */
.content {
  display: flex;
  flex: 1;
  justify-content: space-between;
  gap: 30px;
  padding: 20px;
}

/* 左侧进度条 */
.left {
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 40px;
}

/* 中间答题区域 */
.center {
  width: 55%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
}

/* 右侧题目列表 */
.right {
  width: 20%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 悬浮聊天窗口 */
.chatbot {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #333;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}

/* 模式切换按钮 */
.mode-switch {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #ff7f50;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

/* 悬浮按钮 */
.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff7f50;
  color: white;
  font-size: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

/* 弹出框遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 弹出框样式 */
.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

</style>
