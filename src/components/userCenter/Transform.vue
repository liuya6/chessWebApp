<template>
  <div class="Transform">
    <div>
      <my-userTitle></my-userTitle>
    </div>
    <div
      class="content"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(255, 255, 255, 0.3)"
    >
      <div class="top">
        <div>
          <p>
            <span>钱包余额</span><span>{{ userInfo.coin }}元</span>
          </p>
          <b @click="guihu">一键归户</b>
        </div>
        <ul>
          <li v-for="(item, i) in third_Game_Lists" :key="i">
            <h3>{{ item.name }}</h3>
            <span>{{ moneyList[i] }}</span>
          </li>
        </ul>
      </div>
      <div class="btm">
        <div>手动转出</div>
        <div>
          <span>转出</span>
          <el-select
            v-model="parameter.apiKey"
            placeholder="请选择"
            class="select"
            @change="changeIndex"
          >
            <el-option
              v-for="(item, j) in third_Game_Lists"
              :key="j"
              :label="item.name.replace(/\余额/g, '游戏')"
              :value="item.typeKey"
            >
            </el-option>
          </el-select>
        </div>
        <div>
          <span>金额</span>
          <el-input
            class="moneyInput"
            v-model="parameter.money"
            placeholder="输入转入金额"
          ></el-input>
        </div>
        <b @click="confirm">
          额度转出
        </b>
      </div>
    </div>
  </div>
</template>

<script>
import {
  thirdMoney,
  exchangeAllToLottery,
  exchangeMoney,
  thirdGameList
} from "../../api";
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "Transform",
  data() {
    return {
      loading: false,
      parameter: {
        type: 1, //1=转出，2=转入
        apiKey: "",
        money: ""
      },
      gameIndex: "",
      moneyList: []
    };
  },
  created() {
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
    ...mapActions(["userDetails"]),
    ...mapMutations(["SET_THIRD_GAME_LIST"]),
    getThirdGameList() {
      this.loading = true;
      thirdGameList().then(res => {
        this.loading = false;
        this.$store.commit("SET_THIRD_GAME_LIST", res.data);
        this.initMoney();
      });
    },
    getThirdMoney(typekey) {
      thirdMoney({ type: typekey })
        .then(res => {
          if (res.status) {
            this.moneyList.splice(
              this.gameIndex,
              1,
              res.data.money == "0" ? "0.00" : res.data.money
            );
          } else {
            this.moneyList.splice(this.gameIndex, 1, "0.00");
          }
        })
        .catch(err => {
          console.log(err);
          this.moneyList.splice(this.gameIndex, 1, "获取失败");
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
    },
    changeIndex(type) {
      for (let i in this.third_Game_Lists) {
        let item = this.third_Game_Lists[i];
        if (item.typeKey == type) {
          this.gameIndex = i;
        }
      }
    },
    guihu() {
      this.loading = true;
      exchangeAllToLottery().then(res => {
        this.loading = false;
        this.initMoney();
        this.userDetails();
        if (res.status) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    confirm() {
      if (!this.parameter.money) {
        return this.$message.error("请输入金额");
      }
      if (!this.parameter.apiKey) {
        return this.$message.error("请选择转出游戏");
      }
      this.loading = true;
      exchangeMoney(this.parameter).then(res => {
        this.loading = false;
        if (res.status) {
          this.$message.success(res.msg);
          this.getThirdMoney(this.parameter.apiKey);
          this.userDetails();
          this.parameter.money = "";
          this.parameter.apiKey = "";
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.Transform {
  min-height: 720px;
  background-color: #fff;
  .content {
    .select {
      width: 130px;
      margin-right: 10px;
    }
    .moneyInput {
      width: 253px;
    }
    .top {
      background-color: #f0f0f0;
      margin: 26px 14px 20px 14px;
      min-height: 208px;
      div {
        overflow: hidden;
        p {
          float: left;
          margin-top: 42px;
          margin-left: 18px;
          span {
            &:first-child {
              font-size: 14px;
              color: #666666;
              margin-right: 31px;
            }
            &:last-child {
              font-size: 23px;
              color: #e60011;
            }
          }
        }
        b {
          margin-top: 29px;
          float: right;
          width: 164px;
          height: 44px;
          line-height: 44px;
          text-align: center;
          background: linear-gradient(#fdc937, #f37334);
          font-size: 16px;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          margin-right: 16px;
        }
      }
      ul {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding: 28px 0;
        margin: 0 20px;
        li {
          margin: 8px 0 0 10px;
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
    .btm {
      height: 80px;
      border: 1px dashed #e3ebf6;
      background-color: #f0f0f0;
      margin: 0 13px;
      line-height: 80px;
      font-size: 13px;
      div {
        float: left;
        &:first-child {
          margin-left: 44px;
          margin-right: 85px;
        }
        &:nth-child(2) {
          span {
            margin-right: 12px;
            float: left;
          }
        }
        &:nth-child(3) {
          margin-left: 46px;
          span {
            margin-right: 12px;
            float: left;
          }
        }
      }
      b {
        float: right;
        color: #fff;
        width: 164px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        background-color: #6d85cf;
        font-size: 15px;
        border-radius: 5px;
        margin-top: 16px;
        margin-right: 16px;
        cursor: pointer;
      }
    }
  }
}
@media screen and (max-width: 1400px) {
  .Transform {
    .content {
      .top {
        ul {
          li {
            margin: 8px 0 0 10px;
            width: 110px;
          }
        }
      }
      .btm {
        div {
          float: left;
          &:first-child {
            margin-right: 55px;
          }
        }
      }
    }
  }
}
</style>
