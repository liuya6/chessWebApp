<template>
  <div
    class="top"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.3)"
  >
    <div class="top_content w1400">
      <div class="left">
        <i>
          <img src="/images/trump.png" alt="" />
        </i>
        <!-- v-html="advertisement" -->
        <marquee>
          {{ webGG || setting.webGG }}
        </marquee>
      </div>
      <div class="right">
        <div v-if="!isLogin" class="noLogin">
          <router-link to="/login">登录/注册</router-link>
        </div>
        <div v-else class="isLogin">
          <!--          <i>-->
          <!--            <img src="/images/email.png" alt="" draggable="false" />-->
          <!--          </i>-->
          <span class="money">可用余额：￥{{ userInfo.coin }}</span>
          <span
            v-for="(item, j) in arr"
            :key="j"
            :class="item.class"
            @click="goUser(item.firstName, item.name, item.type)"
            >{{ item.name }}</span
          >
          <span class="guiHu" @click="guihu">一键归户</span>
          <div class="user">
            <b>
              <img :src="userInfo.avatar" alt="" draggable="false" />
            </b>
            <span>{{ userInfo.username }}</span>
            <div>
              <p
                v-for="(item, i) in List"
                :key="i"
                @click="goUser(item.firstName, item.name, item.type)"
              >
                {{ item.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import { mapGetters, mapActions } from "vuex";
import { loginOut, exchangeAllToLottery } from "@/api";
const List = [
  { name: "个人信息", firstName: "账户信息", type: "Information" },
  { name: "额度转换", firstName: "资金管理", type: "Transform" },
  { name: "当日统计", firstName: "账目明细", type: "Statistical" },
  { name: "账变记录", firstName: "账目明细", type: "AccountChange" },
  { name: "游戏记录", firstName: "游戏记录", type: "GameRecord" },
  { name: "活动申请", firstName: "活动申请", type: "Activity" },
  { name: "退出登录" }
];
const arr = [
  { name: "充值", firstName: "资金管理", type: "Recharge", class: "recharge" },
  { name: "提现", firstName: "资金管理", type: "Withdraw", class: "withdraw" }
];
export default {
  name: "Top",
  data() {
    return {
      List,
      arr,
      isLogin: false,
      loading: false
    };
  },
  props: ["webGG"],
  computed: {
    ...mapGetters(["userInfo", "setting"])
  },
  created() {
    this.LoginStatus(this.userInfo);
    console.log(this.sessionStorage);
  },
  activated() {
    this.LoginStatus(this.userInfo);
  },
  watch: {
    userInfo(newVal) {
      console.log("22222222222222");
      this.LoginStatus(newVal);
    }
  },
  methods: {
    ...mapActions(["userDetails"]),
    goUser(firstName, lastName, type) {
      if (type) {
        this.$emit("type", type);
        this.$router.push({
          name: "user",
          query: {
            type: Base64.encode(type),
            firstName: Base64.encode(firstName),
            lastName: lastName !== firstName ? Base64.encode(lastName) : ""
          }
        });
      } else {
        this.$msgbox
          .confirm("确定退出账号吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            loginOut().then(res => {
              console.log(res);
              if (res.status) {
                this.$message({
                  type: "success",
                  showClose: true,
                  message: res.data,
                  center: true
                });
                this.isLogin = false;
                this.$router.push({ name: "login" });
                this.$store.commit("SET_USER_INFO", "");
                this.$store.commit("SET_MY_BANK", "");
                sessionStorage.clear();
              }
            });
          })
          .catch(res => {
            console.log(res, "点了取消");
          });
      }
    },
    guihu() {
      this.loading = true;
      exchangeAllToLottery().then(res => {
        this.loading = false;
        this.userDetails();
        if (res.status) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    LoginStatus(val) {
      if (val || val.username) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.top {
  width: 100%;
  min-width: 1400px;
  background-color: #22262a;
  height: 44px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  .top_content {
    .left {
      float: left;
      width: 690px;
      overflow: hidden;
      i {
        float: left;
        width: 44px;
        height: 44px;
        img {
          width: 100%;
          height: 100%;
          transform: scale(0.4);
        }
      }
      marquee {
        float: left;
        width: 640px;
        line-height: 44px;
        color: #fff;
      }
    }
    .right {
      color: white;
      line-height: 44px;
      .noLogin {
        text-align: right;
        a {
          margin-right: 5px;
          color: #727480;
          font-size: 16px;
          &:hover {
            color: #f3e232;
          }
        }
      }
      .isLogin {
        display: flex;
        justify-content: flex-end;
        text-align: center;
        line-height: 44px;
        img {
          width: 100%;
          height: 100%;
        }
        i {
          display: inline-block;
          width: 26px;
          height: 20px;
          margin-top: 12px;
        }
        b {
          display: inline-block;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;
          vertical-align: middle;
        }
        span {
          display: inline-block;
          vertical-align: middle;
          line-height: 24px;
          margin-left: 16px;
          margin-top: 9px;
          cursor: pointer;
          font-size: 15px;
        }
        .money {
          font-size: 15px;
          cursor: default;
        }
        .recharge {
          width: 50px;
          height: 24px;
          border-radius: 3px;
          background: linear-gradient(#fcc630, #f37835);
        }
        .withdraw {
          width: 50px;
          height: 24px;
          border-radius: 3px;
          background: linear-gradient(#00abf1, #3628fb);
        }
        .guiHu {
          width: 73px;
          height: 24px;
          border-radius: 3px;
          background: linear-gradient(#00abf1, #3628fb);
        }
        .user {
          width: 166px;
          height: 44px;
          background-color: #3a4651;
          margin-left: 18px;
          span {
            margin-top: 0;
            margin-left: 10px;
          }
          &:hover p {
            height: 44px;
          }
          p {
            color: white;
            font-size: 15px;
            line-height: 44px;
            height: 0;
            overflow: hidden;
            background-color: #3a4651;
            cursor: pointer;
            transition: 0.2s;
            &:hover {
              background-color: #696969;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1400px) {
  .top {
    .top_content {
      .left {
        width: 550px;
        marquee {
          width: 500px;
        }
      }
      .right {
        .noLogin {
          a {
            font-size: 12px;
          }
        }
        .isLogin {
          span {
            margin-left: 9px;
            margin-top: 9px;
            font-size: 12px;
          }
          .money {
            font-size: 12px;
            margin-left: 0;
            white-space: nowrap;
          }
          .user {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
