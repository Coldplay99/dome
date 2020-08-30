import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import rerst from '@/assets/rerst.css'

import myBreat from '@/components/home/myBreat.vue'

import MyHttp from '@/plugins/http.js'

// import axios from 'axios'
// //挂载在Vue的原型上
// Vue.prototype.axios=axios
Vue.use(ElementUI)
Vue.use(MyHttp)
Vue.config.productionTip = false

//全局过滤日期
Vue.filter('fildate',(v)=>{
  return moment(v).format('YYYY-MM-DD')
})

Vue.component('my-breat',myBreat)
  

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
