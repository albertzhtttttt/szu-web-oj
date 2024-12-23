// store/courseStore.js
import { defineStore } from 'pinia'

export const useCourseStore = defineStore('course', {
    state: () => ({
        selectedCourse: null
    }),
    actions: {
        setCourse(course) {
            this.selectedCourse = course
        }
    }
})
