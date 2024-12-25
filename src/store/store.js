// store/courseStore.js
import { defineStore } from 'pinia'

export const useCourseStore = defineStore('course', {
    state: () => ({
        selectedCourse: null,  // 当前选择的课程
        courses: []           // 课程列表
    }),
    actions: {
        // 设置选中的课程
        setCourse(course) {
            this.selectedCourse = course
        },

        // 加载课程列表，如果本地存储中没有数据则使用默认数据
        loadCourses() {
            const storedCourses = localStorage.getItem('courses')
            if (storedCourses) {
                this.courses = JSON.parse(storedCourses)  // 从 localStorage 加载课程数据
            } else {
                this.courses = this.getDefaultCourses()  // 如果没有数据，使用默认课程
                this.saveCourses()  // 保存默认课程到 localStorage
            }
        },

        // 保存课程数据到 localStorage
        saveCourses() {
            localStorage.setItem('courses', JSON.stringify(this.courses))
        },

        // 获取默认课程列表
        getDefaultCourses() {
            return [
                {
                    image: 'src/assets/rec6.png',
                    name: '英语畅谈中国',
                    teacher: '湖北大学 / 王志茹',
                    status: '开课中',
                    info: '这是课程简介',
                },
                {
                    image: 'src/assets/rec7.png',
                    name: '现代科技与人类未来',
                    teacher: '大连大学 / 刘金涛',
                    status: '已结束',
                    info: '这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介',
                },
                {
                    image: 'src/assets/rec8.png',
                    name: '宇宙探索与发现',
                    teacher: '大连大学 / 刘金涛',
                    status: '已结束',
                    info: '这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介',
                },
                {
                    image: 'src/assets/rec9.png',
                    name: '女生穿搭技巧',
                    teacher: '南昌大学 / 吴小吟',
                    status: '已结束',
                    info: '这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介',
                },
                {
                    image: 'src/assets/rec10.png',
                    name: '大学生职业生涯',
                    teacher: '昆明理工大学 / 洪云',
                    status: '已结束',
                    info: '这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介',
                },
                {
                    image: 'src/assets/rec11.png',
                    name: '无处不在-传染病',
                    teacher: '南昌大学 / 孙水林',
                    status: '已结束',
                    info: '这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介',
                },
                {
                    image: 'src/assets/rec12.png',
                    name: '中国近现代史纲要',
                    teacher: '广州大学 / 张雪娇',
                    status: '已结束',
                    info: '这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介',
                },
                {
                    image: 'src/assets/rec13.png',
                    name: '生死学',
                    teacher: '广州大学 / 胡宣安',
                    status: '已结束',
                    info: '这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介这是课程简介',
                }
            ]
        },

        // 添加课程
        addCourse(course) {
            this.courses.push(course);
            this.saveCourses();  // 保存更新后的课程列表到 localStorage
        },

        // 提交作业
        async submitAssignment(courseId, formData) {
            try {
                // 直接将作业添加到课程的任务列表中
                const course = this.courses.find(course => course.id === courseId);
                if (course) {
                    const assignmentData = {};
                    for (let [key, value] of formData.entries()) {
                        if (key === 'files') {
                            assignmentData[key] = Array.from(value).map(file => ({
                                name: file.name,
                                type: file.type,
                                size: file.size,
                                lastModified: file.lastModified,
                            }));
                        } else {
                            assignmentData[key] = value;
                        }
                    }

                    course.tasks.push(assignmentData);
                    this.saveCourses();  // 保存更新后的课程列表到 localStorage

                    console.log('作业提交成功:', assignmentData);
                    return true;
                } else {
                    console.error('找不到课程:', courseId);
                    return false;
                }
            } catch (error) {
                console.error('提交失败:', error);
                return false;
            }
        }
    },
    getters: {
        // 根据课程ID获取课程
        getCourseById: (state) => (id) => state.courses.find(course => course.id === id),
    }
});