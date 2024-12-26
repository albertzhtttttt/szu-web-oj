<template>
  <div class="my-courses">
    <h3>已注册课程</h3>
    <div class="course-list">
      <div class="course-card" v-for="(course, index) in courses" :key="index">
        <div class="course-image-container">
          <img :src="course.image" alt="课程图片" class="course-image" />
        </div>
        <div class="course-info">
          <h4 class="course-name">{{ course.name }}</h4>
          <p class="course-teacher">{{ course.teacher }}</p>
          <p class="course-description">课程简介: <span class="description">这是一个课程的简介，详细内容可以在后续页面查看。</span></p>
          <!-- 查看详情按钮 -->
          <router-link :to="`/course/detail/${index}`">
            <button class="view-button">查看详情</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'MyCourses',
  setup() {
    const courses = ref([
      {
        image: 'src/assets/rec1.png',
        name: '软件工程',
        teacher: '深圳大学 / 杜文峰'
      },
      {
        image: 'src/assets/rec2.png',
        name: '云计算基础及应用',
        teacher: '深圳大学 / 明仲'
      },
      {
        image: 'src/assets/rec3.jpg',
        name: '舞蹈与健康',
        teacher: '武汉科技大学 / 袁芳'
      },
      {
        image: 'src/assets/rec4.png',
        name: '药物的奥秘',
        teacher: '三峡大学 / 罗华军'
      },
      {
        image: 'src/assets/rec5.png',
        name: '词曲小说中的人生大爱',
        teacher: '湖北大学 / 薛海'
      }
    ]);

    return { courses };
  }
};
</script>

<style scoped>
.my-courses {
  padding: 20px;
  background-color: #f9f9f9;
}

h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
}

.course-list {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  gap: 20px; /* 卡片之间的间隙 */
  justify-content: space-between; /* 调整卡片对齐方式 */
}

.course-card {
  display: flex; /* 横向排列图片和内容 */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  padding: 15px;
  position: relative;
  width: calc(50% - 10px); /* 每行显示两个卡片 */
  height: 180px; /* 高度自适应 */
}

.course-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.course-image-container {
  flex-shrink: 0;
  width: 33%; /* 图片宽度占卡片的1/3 */
  height: 100%; /* 高度自适应 */
  margin-right: 20px;
  display: flex;
  justify-content: flex-end; /* 图片向右对齐 */
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 按比例缩放图片 */
  border-radius: 8px;
}

.course-info {
  flex-grow: 1; /* 让信息部分占据剩余空间 */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 内容与按钮对齐 */
}

.course-name {
  font-size: 1.4rem;
  font-weight: bold;
  margin: 10px 0;
  text-align: left; /* 文字左对齐 */
}

.course-teacher {
  font-size: 1rem;
  color: #555;
  text-align: left; /* 文字左对齐 */
}

.course-description {
  font-size: 0.9rem;
  color: #777;
  text-align: left; /* 文字左对齐 */
}

.description {
  color: #333;
}

.view-button {
  position: absolute;
  bottom: 15px; /* 调整按钮的位置 */
  right: 15px;
  padding: 8px 15px;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.view-button:hover {
  background-color: #66b1ff;
}
</style>
