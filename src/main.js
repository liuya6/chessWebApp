import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "./style/index.scss";
import "./plugins/element.js";
import "./plugins/iview.js";

//银行卡复制模块
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);
//cookies
import VueCookies from "vue-cookies";
Vue.use(VueCookies);
//全局组件
import Top from "./components/common/Top";
import Header from "./components/common/Header";
import Foot from "./components/common/Footer";
import UserTitle from "./components/userCenter/userTitle";
import Kefu from "./components/common/Kefu";
Vue.component("my-kefu", Kefu);
Vue.component("my-header", Header);
Vue.component("my-top", Top);
Vue.component("my-foot", Foot);
Vue.component("my-userTitle", UserTitle);

//element
import {
  Carousel,
  CarouselItem,
  DatePicker,
  Select,
  Option,
  Input,
  Message,
  Pagination,
  Notification,
  MessageBox,
  Loading,
  Steps,
  Step,
  Icon,
  Cascader,
  TimePicker
} from "element-ui";
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(Pagination);
Vue.use(Loading.directive);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Icon);
Vue.use(Cascader);
Vue.use(TimePicker);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
//iview

//解析时间戳
Vue.prototype.timestampToString = function(timestamp = +new Date()) {
  if (timestamp) {
    let time = new Date(timestamp * 1000);
    let y = time.getFullYear();
    let M = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();
    M = M < 10 ? "0" + M : M;
    d = d < 10 ? "0" + d : d;
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    return y + "-" + M + "-" + d + " " + h + ":" + m + ":" + s;
  } else {
    return "";
  }
};
Vue.prototype.$_eval = function(fn) {
  return new Function("return" + fn)();
};

Vue.prototype.playGame = function(url) {
  if (!this.$store.getters.userInfo) {
    return this.$message.error({
      message: "请登录后开始游戏",
      center: true
    });
  }
  window.open(url, "_blank", "height=700, width=1200, top=100, left=100");
  // console.log(url, type, "111111111111111111111111111111");
  // if (type == "AG") {
  //   return window.open(url);
  // }
  // this.$store.commit("SET_GAME_URL", url);
  // this.$router.push({
  //   name: "playing"
  // });
};

Vue.prototype.reCharge = function(url) {
  if (!this.$store.getters.userInfo) {
    return this.$message.error({
      message: "请登录后进行充值",
      center: true
    });
  }
  window.open(url);
};

Vue.prototype.bankNum = function(card) {
  try {
    return card
      .replace(/\s/g, "")
      .replace(/(\d{4})\d+(\d{4})$/, "$1 **** **** $2");
  } catch (e) {
    // console.log(e);
  }
};

Vue.directive("title", {
  // 指令的定义
  inserted: function(el, binding) {
    if (!router.currentRoute.meta.keepAlive) {
      let titles = router.app.$options.store.getters.webName || "";
      if (binding.value !== "") {
        titles = binding.value + " - " + titles;
      }
      document.title = titles;
    }
  },
  update: function() {
    if (router.currentRoute.meta.keepAlive) {
      let titles = router.app.$options.store.getters.webName || "";
      let bindingVal = router.currentRoute.meta.DocumentTitle;
      titles = bindingVal + " - " + titles;
      document.title = titles;
    }
  }
});

Vue.config.productionTip = false;
console.log("入口文件");
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
