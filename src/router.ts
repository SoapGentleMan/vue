import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from './examples/index.vue'
import TsIndex from './examples/index.tsx.vue'

Vue.use(VueRouter);
// 还有将动态路由里的参数或者自定义的值作为属性传给组件的设定，props（存在命名视图时，以props里的命名视图的值来对照） 参数，bool：动态路由参数， 对象：原样传给组件， 函数：返回值给组件
export default new VueRouter({
  routes: [
    {
      path: '/index', component: Index, alias: '/main'
    },
    {
      path: '/index-ts', component: TsIndex, alias: '/main-ts'
    },
    {
      path: '/', redirect: '/index'
    }
  ],
  mode: 'history'
})
