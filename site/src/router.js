import { createRouter, createWebHistory } from 'vue-router'
import LandingView from './views/LandingView.vue'
import LessonsIndexView from './views/LessonsIndexView.vue'
import LessonView from './views/LessonView.vue'
import DiagramsGalleryView from './views/DiagramsGalleryView.vue'
import ReferenceView from './views/ReferenceView.vue'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView,
    meta: { title: 'PWM Car Mechanics — Learning Hub & Presentation' },
  },
  {
    path: '/lessons',
    name: 'lessons',
    component: LessonsIndexView,
    meta: { title: 'Curriculum Index — PWM Car Mechanics' },
  },
  {
    path: '/lessons/:slug',
    name: 'lesson',
    component: LessonView,
    meta: { title: 'Lesson — PWM Car Mechanics' },
  },
  {
    path: '/diagrams',
    name: 'diagrams',
    component: DiagramsGalleryView,
    meta: { title: 'Shared Interactive Diagrams — PWM Car Mechanics' },
  },
  {
    path: '/reference',
    name: 'reference',
    component: ReferenceView,
    meta: { title: 'PWM Basics & Diagnostics Cheat Sheet — PWM Car Mechanics' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
