import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TreeTable from 'vue-table-with-tree-grid'

//导入字体图标
import './assets/font_6wzyq7bitqb/iconfont.css'
import './assets/font_bzmcg3glocs/iconfont.css'

//完整引入elementsui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//导入全局样式表
import './assets/css/glaobl.css'

//导入富文本编辑器
import VueQuillEditor from  'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//导入axios
import axios from 'axios'
axios.defaults.baseURL='http://119.23.53.78:8888/api/private/v1'

// 拦截器
axios.interceptors.request.use(config=>{
  // console.log(config);
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http=axios


//注册富文本编辑器，注册为全局可用组件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

//全局注册表格树
Vue.component('tree-table',TreeTable)

// 全局过滤器
Vue.filter('dateFromat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')

  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
