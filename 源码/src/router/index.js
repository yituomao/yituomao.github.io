import Vue from 'vue'
import Router from 'vue-router'
import Carousel from '@/components/Carousel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Carousel',
      component: Carousel
    }
  ]
})
