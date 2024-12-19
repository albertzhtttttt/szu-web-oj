// server.js
import express, { json } from 'express';
import { connect, Schema, model } from 'mongoose';
import cors from 'cors';
const app = express();
const port = 5000;

// 连接到 MongoDB 数据库
connect('mongodb://localhost:27017/school', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 定义课程模型
const courseSchema = new Schema({
  name: String,
});

const Course = model('Course', courseSchema);

// 定义学生成绩模型
const studentSchema = new Schema({
  name: String,
  grade: Number,
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' }, // 关联课程
});

const Student = model('Student', studentSchema);

// 使用中间件解析请求体
app.use(json());
app.use(cors());

// 获取所有课程
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();  // 查询所有课程
    res.json(courses);
  } catch (error) {
    console.error("查询课程失败", error);
    res.status(500).json({ message: "查询课程数据失败" });
  }
});

// 添加课程
app.post('/api/courses', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: '课程名称是必填的' });
  }
  try {
    const newCourse = new Course({ name });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("添加课程失败", error);
    res.status(500).json({ message: "添加课程失败" });
  }
});

// 获取所有学生成绩
app.get('/api/grades', async (req, res) => {
  try {
    const students = await Student.find().populate('courseId');  // 查找成绩并关联课程
    res.json(students);
  } catch (error) {
    console.error("查询成绩失败", error);
    res.status(500).json({ message: "查询成绩数据失败" });
  }
});

// 添加学生成绩
app.post('/api/grades', async (req, res) => {
  const { name, grade, courseId } = req.body;
  if (!name || grade === undefined || !courseId) {
    return res.status(400).json({ message: '姓名、成绩和课程是必填的' });
  }
  try {
    const newStudent = new Student({ name, grade, courseId });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("添加成绩失败", error);
    res.status(500).json({ message: "添加成绩数据失败" });
  }
});

// 默认数据初始化函数
async function initializeData() {
  try {
    // 检查课程是否已经存在
    const courses = await Course.find();
    if (courses.length === 0) {
      // 如果没有课程，插入一些默认课程
      const defaultCourses = [
        { name: '数学' },
        { name: '英语' },
        { name: '计算机科学' }
      ];
      await Course.insertMany(defaultCourses);
    }

    // 检查成绩是否已经存在
    const students = await Student.find();
    if (students.length === 0) {
      // 如果没有学生成绩，插入一些默认成绩
      const courseIds = await Course.find().select('_id');
      const defaultStudents = [
        { name: '张三', grade: 85, courseId: courseIds[0]._id },
        { name: '李四', grade: 92, courseId: courseIds[1]._id },
        { name: '王五', grade: 78, courseId: courseIds[2]._id }
      ];
      await Student.insertMany(defaultStudents);
    }
  } catch (error) {
    console.error("初始化数据失败", error);
  }
}

// 调用初始化函数
initializeData();

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
