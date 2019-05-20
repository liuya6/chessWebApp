<template>
  <div class="Information">
    <div>
      <my-userTitle></my-userTitle>
    </div>
    <div class="content">
      <div class="top">
        <div>
          <img :src="userInfo.avatar" alt="" draggable="false" />
        </div>
        <div>
          <p>{{ userInfo.username }}</p>
          <p>
            <span>注册时间： {{ timestampToString(userInfo.regTime) }}</span>
            <span>手机号： {{ userInfo.mobile || "---" }}</span>
          </p>
        </div>
      </div>
      <div class="middle">
        <h3>账户安全信息</h3>
        <div>
          <span>上次登录时间：{{ timestampToString(userInfo.loginTime) }}</span>
        </div>
      </div>
      <div class="btm">
        <h3>游戏余额</h3>
        <!--        <ul>-->
        <!--          <li>-->
        <!--            <i></i>-->
        <!--            <span>可用余额</span>-->
        <!--            <span>{{ userInfo.coin }}元</span>-->
        <!--          </li>-->
        <!--          <li>-->
        <!--            <i></i>-->
        <!--            <span>历史总投注</span>-->
        <!--            <span>{{ userInfo.allbet }}元</span>-->
        <!--          </li>-->
        <!--          <li>-->
        <!--            <i></i>-->
        <!--            <span>历史总盈利</span>-->
        <!--            <span>{{ userInfo.profit }}元</span>-->
        <!--          </li>-->
        <!--        </ul>-->
        <ul>
          <li v-for="(item, i) in third_Game_Lists" :key="i">
            <h3>{{ item.name }}</h3>
            <span>{{ moneyList[i] }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { thirdMoney, thirdGameList } from "../../api";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "Information",
  data() {
    return {
      thirdGameLists: [],
      loading: false,
      moneyList: []
    };
  },
  created() {
    console.log(
      this.third_Game_Lists,
      "游戏列表-----------------------------------"
    );
    if (!this.third_Game_Lists || !this.third_Game_Lists.length) {
      this.getThirdGameList();
    } else {
      this.initMoney();
    }
  },
  computed: {
    ...mapGetters(["userInfo", "third_Game_Lists"])
  },
  methods: {
    ...mapMutations(["SET_THIRD_GAME_LIST"]),
    getThirdGameList() {
      this.loading = true;
      thirdGameList().then(res => {
        this.loading = false;
        this.$store.commit("SET_THIRD_GAME_LIST", res.data);
        this.thirdGameLists = res.data;
        this.initMoney();
      });
    },
    initMoney() {
      for (let i in this.third_Game_Lists) {
        let item = this.third_Game_Lists[i];
        this.moneyList[i] = "获取中...";
        thirdMoney({ type: item.typeKey })
          .then(res => {
            if (res.status) {
              console.log(res.data.money);
              this.moneyList.splice(
                i,
                1,
                res.data.money == "0" ? "0.00" : res.data.money
              );
            } else {
              this.moneyList.splice(i, 1, "0.00");
            }
          })
          .catch(err => {
            console.log(err);
            this.moneyList.splice(i, 1, "获取失败");
          });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.Information {
  width: 100%;
  .content {
    .top {
      height: 184px;
      border-bottom: 1px solid #e3ebf6;
      div {
        float: left;
        img {
          height: 100%;
        }
        &:first-child {
          width: 125px;
          height: 125px;
          border-radius: 50%;
          overflow: hidden;
          margin-left: 39px;
          margin-top: 31px;
        }
        &:last-child {
          margin-left: 28px;
          p:first-child {
            font-size: 19px;
            margin-top: 57px;
          }
          p:last-child {
            margin-top: 23px;
            font-size: 13px;
            color: #a1a1a1;
            span:last-child {
              margin-left: 48px;
            }
          }
        }
      }
    }
    .middle {
      padding-left: 29px;
      height: 143px;
      border-bottom: 1px solid #e3ebf6;
      h3 {
        font-size: 19px;
        line-height: 93px;
      }
      div {
        span {
          color: #a1a1a1;
          font-size: 13px;
        }
      }
    }
    .btm {
      padding-left: 29px;
      height: 422px;
      > h3 {
        font-size: 19px;
        margin: 32px 0;
      }
      ul {
        display: flex;
        justify-content: start;
        flex-wrap: wrap;
        padding: 28px 0;
        /*margin: 0 20px;*/
        li {
          margin: 8px 0 0 15px;
          width: 130px;
          height: 68px;
          text-align: center;
          box-sizing: border-box;
          border: 1px solid #e3ebf6;
          background-color: #fafafa;
          border-radius: 3px;
          &:nth-of-type(7n + 1) {
            margin-left: 0 !important;
          }
          h3 {
            margin-top: 15px;
            font-size: 15px;
            color: #666666;
          }
          span {
            color: #a0a0a0;
            font-size: 14px;
          }
        }
      }
    }
  }
}
/*      ul {
        margin-left: 160px;
        li {
          margin-top: 85px;
          &:first-child {
            margin-top: 0;
          }
          span {
            font-size: 13px;
            color: #999999;
            &:nth-child(2) {
              display: inline-block;
              width: 85px;
              margin-left: 43px;
            }
            &:last-child {
              margin-left: 185px;
            }
          }
          i {
            display: inline-block;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: #e3ebf6;
            vertical-align: middle;

            position: relative;
            &:before {
              content: "";
              display: inline-block;
              width: 10px;
              height: 10px;
              background-color: #fff;
              border-radius: 50%;
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              margin: auto;
            }
            &:after {
              content: "";
              display: inline-block;
              height: 85px;
              width: 6px;
              background-color: #e3ebf6;
              position: absolute;
              top: 22px;
              left: 50%;
              transform: translate(-50%, 0);
            }
          }
          &:last-child {
            i {
              overflow: hidden;
            }
          }
        }
      }
*/
@media screen and (max-width: 1400px) {
  .Information {
    .content {
      .btm {
        height: 422px;
        > h3 {
          margin: 32px 0;
        }
        ul {
          padding: 10px 0;
          li {
            margin: 8px 0 0 5px;
            width: 110px;
          }
        }
      }
    }
  }
}
</style>
