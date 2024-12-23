const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');  // 导入 path 模块

const app = express();
const PORT = 5000;  // 监听端口
const gradesFilePath = './grades.json'; // 成绩数据的文件路径
const coursesFilePath = './courses.json'; // 课程数据的文件路径

// 使用中间件
app.use(cors());
app.use(bodyParser.json());

// 启动服务器并监听端口
app.listen(PORT, () => {
  console.log(`服务器正在运行，端口：${PORT}`);
});

// 获取成绩列表
app.get('/api/grades', (req, res) => {
  const gradesData = fs.readFileSync(gradesFilePath, 'utf8'); // 使用 gradesFilePath
  res.json(JSON.parse(gradesData));
});

// 添加成绩
app.post('/api/grades', (req, res) => {
  const { student, course, grade } = req.body;
  if (!student || !course || !grade) {
    return res.status(400).send('缺少必要的参数');
  }

  const newGrade = { student, course, grade };

  // 读取当前成绩列表
  const gradesData = JSON.parse(fs.readFileSync(gradesFilePath, 'utf8')); // 使用 gradesFilePath

  // 添加新成绩
  gradesData.push(newGrade);

  // 保存成绩数据
  fs.writeFileSync(gradesFilePath, JSON.stringify(gradesData, null, 2)); // 使用 gradesFilePath

  res.status(201).send('成绩添加成功');
});

// 删除成绩
app.delete('/api/grades/:student/:course', (req, res) => {
  const { student, course } = req.params;

  const gradesData = JSON.parse(fs.readFileSync(gradesFilePath, 'utf8')); // 使用 gradesFilePath

  // 删除指定成绩
  const updatedGrades = gradesData.filter(grade => grade.student !== student || grade.course !== course);

  // 保存更新后的成绩列表
  fs.writeFileSync(gradesFilePath, JSON.stringify(updatedGrades, null, 2)); // 使用 gradesFilePath

  res.send('成绩删除成功');
});

// 工具函数：获取课程数据
const getCourses = () => {
  if (fs.existsSync(coursesFilePath)) {
    const data = fs.readFileSync(coursesFilePath, 'utf-8'); // 使用 coursesFilePath
    return JSON.parse(data);
  }
  return [];
};

// 工具函数：保存课程数据
const saveCourses = (courses) => {
  try {
    fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2)); // 使用 coursesFilePath
    console.log('课程数据已保存');
  } catch (error) {
    console.error('保存课程数据失败:', error);
  }
};

// 获取课程列表
app.get('/api/courses', (req, res) => {
  try {
    const courses = getCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).send('无法读取课程数据');
  }
});

// 添加课程
app.post('/api/courses', (req, res) => {
  try {
    const { name } = req.body;  // 从请求体中获取课程名称
    if (!name) {
      return res.status(400).send('课程名称不能为空');
    }

    const courses = getCourses();

    // 检查课程名称是否已存在
    const existingCourse = courses.find(course => course.name === name);
    if (existingCourse) {
      return res.status(400).send('课程名称已存在');
    }

    const newCourse = { name }; // 创建新的课程数据
    courses.push(newCourse);

    saveCourses(courses); // 保存课程数据

    res.status(201).send('课程添加成功');
  } catch (error) {
    res.status(500).send('添加课程失败');
  }
});

// 删除课程
app.delete('/api/courses/:name', (req, res) => {
  const courseName = req.params.name; // 获取课程名称
  let courses = getCourses();

  // 查找课程并删除
  const courseIndex = courses.findIndex(course => course.name === courseName);

  if (courseIndex === -1) {
    return res.status(404).send('课程未找到');
  }

  courses.splice(courseIndex, 1); // 删除课程

  saveCourses(courses); // 保存更新后的课程列表
  res.status(200).send({ message: '课程删除成功' });
});
