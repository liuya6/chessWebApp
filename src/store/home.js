const Home = {
  state: {
    setting: {
      webName: "棋牌",
      articles: ""
    }
  },
  getters: {
    setting: state => {
      return state.setting;
    },
    webName: state => {
      return state.setting.webName;
    },
    articles: state => {
      return state.articles;
    }
  },
  mutations: {
    SET_SETTING: (state, payload) => {
      console.log(payload, "setting");
      state.setting = payload;
    },
    SER_ARTICLE: (state, payload) => {
      state.articles = payload;
    }
  },
  actions: {}
};
export default Home;
