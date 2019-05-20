import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import { LoadingBar } from "iview";
import User from "./user";
import Game from "./game";

const Home = () => import("../views/Home");
const Activitys = () => import("../views/Activitys");

const router = new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes: [
    ...User,
    ...Game,
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        keepAlive: true,
        DocumentTitle: "首页"
      }
    },
    {
      path: "/activity",
      name: "activitys",
      component: Activitys
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});

router.beforeEach((to, from, next) => {
  let userInfo = router.app.$options.store.getters.userInfo;
  if (to.meta.requiresAuth) {
    if (!userInfo) {
      return next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    }
  }
  return next();
});
export default router;
