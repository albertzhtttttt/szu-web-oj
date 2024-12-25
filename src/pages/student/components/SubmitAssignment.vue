<!-- /src/pages/student/components/SubmitAssignment.vue -->
<template>
    <div class="submit-assignment">
      <h2>提交作业</h2>
  
      <!-- 文本输入区 -->
      <div class="form-group">
        <label for="assignmentContent">作业内容</label>
        <textarea v-model="assignmentContent" id="assignmentContent" rows="5" class="form-control"></textarea>
      </div>
  
      <!-- 文件上传区 -->
      <div class="form-group">
        <label for="fileUpload">上传文件</label>
        <input type="file" @change="handleFileChange" multiple id="fileUpload" class="form-control-file">
        <ul v-if="files.length > 0" class="list-group mt-2">
          <li v-for="(file, index) in files" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
            {{ file.name }}
            <button @click="removeFile(index)" class="btn btn-sm btn-danger">移除</button>
          </li>
        </ul>
      </div>
  
      <!-- 预览区 -->
      <div class="preview-area">
        <h3>预览</h3>
        <pre v-if="assignmentContent">{{ assignmentContent }}</pre>
        <div v-if="files.length > 0">
          <p>附件：</p>
          <ul>
            <li v-for="(file, index) in files" :key="index">
              <a :href="file.previewUrl" target="_blank">{{ file.name }}</a>
            </li>
          </ul>
        </div>
      </div>
  
      <!-- 提交按钮 -->
      <button @click="submitAssignment" class="btn btn-primary">提交</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useCourseStore } from '@/store/store';  // 导入 store
  
  const route = useRoute();
  const courseId = parseInt(route.params.id);  // 获取课程 ID
  const courseStore = useCourseStore();
  const assignmentContent = ref('');
  const files = ref([]);
  
  // 处理文件选择
  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const previewUrl = URL.createObjectURL(file);
      files.value.push({ name: file.name, file, previewUrl });
    }
  };
  
  // 移除文件
  const removeFile = (index) => {
    files.value.splice(index, 1);
  };
  
  // 提交作业
  const submitAssignment = async () => {
    try {
      const formData = new FormData();
      formData.append('content', assignmentContent.value);
  
      // 添加所有文件到 FormData
      files.value.forEach((fileObj) => {
        formData.append('files', fileObj.file);
      });
  
      // 调用 store 中的方法来提交作业
      const success = await courseStore.submitAssignment(courseId, formData);
      if (success) {
        alert('作业提交成功！');
        resetForm();
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请重试。');
    }
  };
  
  // 重置表单
  const resetForm = () => {
    assignmentContent.value = '';
    files.value = [];
  };
  </script>
  
  <style scoped>
  .submit-assignment {
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-control,
  .form-control-file {
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  
  .list-group-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .preview-area {
    margin-top: 20px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .preview-area pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  </style>