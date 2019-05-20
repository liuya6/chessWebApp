import { hallBefore, hallType, serchGame, thirdGameList } from "../api";
import { message } from "element-ui";
const game = {
  state: {
    hallList: [], //游戏大类集合 【棋牌，真人,电子】
    currentGame: [], //当前游戏分类
    gameList: [], //当前游戏列表
    total: 0, //当前游戏总数
    title: "", //当前游戏标题
    loading: 0, //是否显示loading
    third_Game_Lists: [], //游戏分类
    gameRecordList: "", //游戏记录列表
    gameUrl: "" //游戏url
  },

  getters: {
    hallList: state => {
      return state.hallList;
    },
    currentGame: state => {
      return state.currentGame;
    },
    gameList: state => {
      return state.gameList;
    },
    total: state => {
      return state.total;
    },
    title: state => {
      return state.title;
    },
    loading: state => {
      return state.loading;
    },
    third_Game_Lists: state => {
      return state.third_Game_Lists;
    },
    gameRecordList: state => {
      return state.gameRecordList;
    },
    gameUrl: state => {
      return state.gameUrl;
    }
  },

  mutations: {
    SET_HALL_BEFORE: (state, payload) => {
      state.hallList = payload;
    },
    SET_CURRENT_GAME: (state, payload) => {
      console.log(payload, "具体游戏分类");
      state.currentGame = payload;
      state.title = payload[0].title;
    },
    SET_GAME_LIST: (state, payload) => {
      state.gameList = payload.list;
      state.total = payload.total;
    },
    CHANGE_TITLE: (state, payload) => {
      state.title = payload;
    },
    CHANGE_LOADING: (state, payload) => {
      state.loading = payload;
    },
    SET_THIRD_GAME_LIST: (state, payload) => {
      state.third_Game_Lists = payload;
    },
    SET_GAME_RECORD_LIST: (state, payload) => {
      console.log(payload, "store,游戏记录列表");
      state.gameRecordList = payload;
    },
    SET_GAME_URL: (state, payload) => {
      state.gameUrl = payload;
    }
  },

  actions: {
    hallBefores(context) {
      hallBefore().then(res => {
        if (res.status) {
          context.commit("SET_HALL_BEFORE", res.data);
        }
      });
    },
    hallTypes({ commit }, payload) {
      hallType(payload).then(res => {
        console.log(res.data, "当前游戏列表");
        commit("CHANGE_LOADING", 0);
        commit("SET_GAME_LIST", res.data);
      });
    },
    serchGames(context, payload) {
      serchGame(payload).then(res => {
        console.log(payload, res);
        context.commit("CHANGE_LOADING", 0);
        if (res.status) {
          context.commit("SET_GAME_LIST", res.data);
        } else {
          return message.error("暂无游戏记录");
        }
      });
    },
    thirdGameLists(context) {
      thirdGameList().then(res => {
        context.commit("SET_THIRD_GAME_LIST", res.data);
      });
    }
  }
};

export default game;
