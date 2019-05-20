import {
  rechargeApply,
  bindingBefore,
  getMyBank,
  userDetail,
  checkLogin
} from "@/api";

const user = {
  state: {
    userInfo: "", //用户详情
    order: "", //充值准备
    bindingList: "", //绑卡准备
    myBank: "" //我的银行卡
  },
  getters: {
    userInfo: state => {
      return state.userInfo;
    },
    order: state => {
      return state.order;
    },
    bindingList: state => {
      return state.bindingList;
    },
    myBank: state => {
      return state.myBank;
    }
  },
  mutations: {
    SET_USER_INFO: (state, payload) => {
      state.userInfo = payload;
    },
    ORDERS: (state, payload) => {
      state.order = payload;
    },
    SET_BANK_BEFORE: (state, payload) => {
      state.bindingList = payload;
    },
    SET_MY_BANK: (state, payload) => {
      state.myBank = payload;
    }
  },
  actions: {
    userDetails({ commit }) {
      userDetail().then(res => {
        // console.log(
        //   res,
        //   "store,个人信息！！！！！！！！！！！！！==========================="
        // );
        if (!res) {
          return commit("SET_USER_INFO", "");
        }
        if (res.status) {
          commit("SET_USER_INFO", res.data);
        }
      });
    },
    checkLogins({ commit }) {
      checkLogin().then(res => {
        console.log(res, "检查登录状态");
        if (!res) {
          return commit("SET_USER_INFO", "");
        }
        if (res.status) {
          commit("SET_USER_INFO", res.data);
        }
      });
    },
    rechargeApplys(context, { id }) {
      context.commit("CHANGE_LOADING", 1);
      rechargeApply({ methodId: id }).then(res => {
        try {
          console.log(res.data, "充值申请记录");
          context.commit("CHANGE_LOADING", 0);
          context.commit("ORDERS", res.data);
        } catch (e) {
          console.log(e);
        }
      });
    },
    bindingBefores({ commit }) {
      bindingBefore().then(res => {
        console.log(res, "绑卡准备");
        commit("SET_BANK_BEFORE", res.data);
      });
    },
    myBanks({ commit }) {
      commit("CHANGE_LOADING", 1);
      getMyBank().then(res => {
        commit("CHANGE_LOADING", 0);
        console.log(res, "我的银行卡");
        commit("SET_MY_BANK", res.data);
      });
    }
  }
};
export default user;
