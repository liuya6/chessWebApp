<template>
  <div class="body" v-title="'个人中心'">
    <my-top @type="type"></my-top>
    <my-kefu></my-kefu>
    <my-header header_black="true"></my-header>
    <div class="content w1400">
      <div class="TabLeft">
        <ul>
          <li
            v-for="(item, i) in TabList"
            :key="i"
            @click="changeTab(item.type, item.name)"
            :class="{ on: isOn(item.children, item.type) }"
          >
            <span
              ><i class="iconfont" v-html="item.iconfont"></i
              >{{ item.name }}</span
            >
            <div>
              <p
                v-for="(child, j) in item.children"
                :key="j"
                @click.stop="changeTab(child.type, item.name, child.name, i)"
                :class="{ on: typeTemplate == child.type }"
              >
                {{ child.name }}
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="contentRight">
        <components
          :is="typeTemplate"
          :userInfo="userInfo"
          @type="type"
        ></components>
      </div>
    </div>
    <my-foot></my-foot>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Base64 } from "js-base64";
const Information = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/Information");
const VIP = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/VIP");
const LoginPwd = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/LoginPwd");
const WithdrawPWd = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/WithdrawPWd");
const BankCard = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/BankCard");
const Recharge = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/Recharge");
const Withdraw = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/Withdraw");
const Transform = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/Transform");
const Statistical = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/Statistical");
const AccountChange = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/AccountChange");
const GameRecord = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/GameRecord");
const Message = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/Message");
const Notice = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/Notice");
const Activity = () =>
  import(/* webpackChunkName:'user' */ "@/components/userCenter/Activity");
const Template = {
  Information,
  VIP,
  LoginPwd,
  WithdrawPWd,
  BankCard,
  Recharge,
  Withdraw,
  Transform,
  Statistical,
  AccountChange,
  GameRecord,
  Message,
  Notice,
  Activity
};
const TabList = [
  {
    name: "账户信息",
    iconfont: "&#xe68c;",
    children: [
      { name: "个人信息", type: "Information" },
      { name: "VIP等级", type: "VIP" },
      { name: "修改登录密码", type: "LoginPwd" },
      { name: "修改提现密码", type: "WithdrawPWd" },
      { name: "银行卡管理", type: "BankCard" }
    ]
  },
  {
    name: "资金管理",
    iconfont: "&#xe68f;",
    children: [
      { name: "在线充值", type: "Recharge" },
      { name: "我要提现", type: "Withdraw" },
      { name: "额度转换", type: "Transform" }
    ]
  },
  {
    name: "账目明细",
    iconfont: "&#xe68e;",
    children: [
      { name: "统计记录", type: "Statistical" },
      { name: "账目记录", type: "AccountChange" }
    ]
  },
  {
    name: "游戏记录",
    type: "GameRecord",
    iconfont: "&#xe68d;"
  },
  {
    name: "公告通知",
    type: "Notice",
    iconfont: "&#xe689;"
  },
  {
    name: "活动申请",
    type: "Activity",
    iconfont: "&#xe68a;"
  }
];
export default {
  name: "User",
  data() {
    return {
      TabList,
      typeTemplate: Base64.decode(this.$route.query.type)
    };
  },
  created() {
    this.userDetails();
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    ...mapActions(["userDetails"]),
    changeTab(type, firstName, lastName) {
      if (type) {
        this.typeTemplate = type;
        this.$router.replace({
          name: "user",
          query: {
            type: Base64.encode(type),
            firstName: Base64.encode(firstName),
            lastName: lastName ? Base64.encode(lastName) : ""
          }
        });
      }
    },
    type(type) {
      this.typeTemplate = type;
    },
    isOn(arr, type) {
      if (arr) {
        return arr.some(item => item.type == this.typeTemplate);
      } else {
        return type == this.typeTemplate;
      }
    }
  },
  components: {
    ...Template
  }
};
</script>

<style scoped lang="scss">
.body {
  padding-top: 135px;
  background: url("/images/bg.jpg") no-repeat;
  -webkit-background-size: 100%;
  background-size: 100%;
  .content {
    display: flex;
    justify-content: flex-start;
    .TabLeft {
      width: 250px;
      font-size: 19px;
      ul {
        li {
          text-align: center;
          color: white;
          height: 60px;
          line-height: 60px;
          background-color: #22262a;
          position: relative;
          cursor: pointer;
          &:hover {
            background-color: #2f3339;
            div {
              width: 160px;
            }
          }
          span {
            i {
              margin-right: 15px;
              font-size: 20px;
            }
          }
          div {
            position: absolute;
            left: 250px;
            font-size: 16px;
            top: 0;
            overflow: hidden;
            z-index: 10;
            transition: 0.1s;
            width: 0;
            p {
              text-align: center;
              color: white;
              height: 60px;
              line-height: 60px;
              background-color: #22262a;
              cursor: pointer;
              &:hover {
                background-color: #2f3339;
              }
            }
          }
        }
        .on {
          background-color: #2f3339;
        }
      }
    }
    .contentRight {
      flex: 1;
      background-color: #fff;
    }
  }
}
@media screen and (max-width: 1400px) {
  .body {
    .content {
      .TabLeft {
        width: 200px;
        font-size: 15px;
        ul {
          li {
            div {
              left: 200px;
              font-size: 13px;
            }
            span {
              i {
                font-size: 18px;
                margin-right: 8px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
