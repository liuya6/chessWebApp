import { activity } from "../api/activity";
const activitys = {
  state: {
    activityArr: [], //当前活动大厅
    loading: 0 //是否显示loading
  },
  getters: {
    activityArr: state => {
      return state.activityArr;
    },
    loading: state => {
      return state.loading;
    }
  },
  mutations: {
    SET_ACTIVITYARR: (state, payload) => {
      state.activityArr = payload;
    }
  },
  actions: {
    activityTypes(context) {
      activity().then(res => {
        if (res.status) {
          context.commit("SET_ACTIVITYARR", res.data);
        }
      });
    }
    // activityTypes({commit},payload){
    //   activityType(payload).then(res=>{
    //     commit("CHANGE_LOADING",0);
    //     commit("SET_ACTIVITYARRLIST",res.data);
    //   })
    // }
  }
};
export default activitys;
