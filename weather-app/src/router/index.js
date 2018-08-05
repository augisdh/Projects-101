import Vue from 'vue'
import Router from 'vue-router'
import weatherTemplate from '@/components/weatherTemplate'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'weatherTemplate',
      component: weatherTemplate,
    }
  ],
  mode: 'history'
})