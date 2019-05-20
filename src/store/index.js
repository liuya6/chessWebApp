import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import createMutationsSharer from "vuex-shared-mutations";

import User from "./user";
import Game from "./game";
import Home from "./home";
// import Activity from './activity';

const handleStore = store => {
  let storage = window.sessionStorage;
  if (!storage) {
    return console.warn("当前浏览器不支持sessionStorage!");
  }
  /* 初始化store */
  if (sessionStorage.store) {
    let state = JSON.parse(sessionStorage.store);
    store.replaceState(state);
  }
  /* 在每个 action 完成后调用 */
  // store.subscribeAction((action, state) => {
  //   console.log(state)
  //   console.log('vuex-subscribeAction=>', action.type, action.payload)
  // })

  /* 在每个 mutation 完成后调用 */
  store.subscribe((mutation, state) => {
    // console.log(state)
    // console.log('vuex-mutation=>', mutation.type, mutation.payload)
    sessionStorage.setItem("store", JSON.stringify(state));
  });
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  modules: {
    User,
    Game,
    Home
  },
  plugins: [
    handleStore,
    createMutationsSharer({
      predicate: (mutation, state) => {
        console.log(state, "vuex-shared-mutations");
        const predicate = ["SET_USER_INFO"];
        return predicate.indexOf(mutation.type) >= 0;
      }
    })
  ]
});
