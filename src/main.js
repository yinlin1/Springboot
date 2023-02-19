import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入 vuex
import store from "@/store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入 request.js 的 request 对象
import request from "@/utils/request";
// 引入本地的 css 样式
import './assets/index.css'
// 引入视频播放组件
import VideoPlayer from 'vue-video-player/src';
import 'vue-video-player/src/custom-theme.css';
import 'video.js/dist/video-js.css'
// 引入音乐播放插件
import vueAplayer from 'vue-aplayer'
Vue.config.productionTip = false
Vue.prototype.request = request
// 引入Markdown组件
import  mavonEditor  from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// 设置适合电脑的控件大小
Vue.use(ElementUI,{size:"small"});
Vue.use(VideoPlayer)
Vue.use(vueAplayer)
Vue.use(mavonEditor)
// 时间戳过滤器
Vue.filter('dateFormat', (dataStr) => {
  const time = new Date(dataStr);

  function timeAdd0 (str) {
    if (str < 10) {
      str = '0' + str
    }
    return str
  }

  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDate();
  const h = time.getHours();
  const mm = time.getMinutes();
  const s = time.getSeconds();
  return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) + ' ' + timeAdd0(h) + ':' + timeAdd0(mm) + ':' + timeAdd0(s)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
