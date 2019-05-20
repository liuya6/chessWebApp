<template>
  <div class="container">
    <my-userTitle></my-userTitle>
    <div class="main">
      <div>
        <b>旧提现密码</b>
        <div class="withdrawPwd">
          <input
            ref="oldInput"
            v-for="i in 6"
            :key="i"
            v-model="oldPassword[i]"
            type="tel"
            maxlength="1"
            style="-webkit-text-security:disc;text-security:disc;"
          />
        </div>
      </div>
      <div>
        <b>新提现密码</b>
        <div class="newWithdrawPwd">
          <input
            ref="newInput"
            v-for="i in 6"
            :key="i"
            v-model="newPassword[i]"
            type="tel"
            maxlength="1"
            style="-webkit-text-security:disc;text-security:disc;"
          />
        </div>
      </div>
      <div>
        <b>再确认密码</b>
        <div class="AgainNewWithdrawPwd">
          <input
            ref="renewInput"
            v-for="i in 6"
            :key="i"
            v-model="newPassword_confirm[i]"
            type="tel"
            maxlength="1"
            style="-webkit-text-security:disc;text-security:disc;"
          />
        </div>
      </div>
      <div>
        <span @click="submit">提交修改</span>
      </div>
      <div class="tis">
        <h3>温馨提示：为了提高账号的安全性，请勿设置过于简单的密码</h3>
        <p>(1)6位纯数字</p>
      </div>
    </div>
  </div>
</template>

<script>
import { nextInput } from "../../common/common";
import { changeWithdrawPwd } from "@/api";
export default {
  name: "WithdrawPWd",
  data() {
    return {
      oldPassword: {},
      newPassword: {},
      newPassword_confirm: {},
      user: {
        oldPassword: {},
        newPassword: {},
        newPassword_confirm: {}
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      nextInput(".withdrawPwd");
      nextInput(".newWithdrawPwd");
      nextInput(".AgainNewWithdrawPwd");
    });
  },
  methods: {
    getPwdStr(userObj) {
      let pwdStr = "";
      for (let i in userObj) {
        let item = userObj[i];
        pwdStr += item;
      }
      console.log(pwdStr);
      return pwdStr;
    },
    submit() {
      if (
        !this.getPwdStr(this.newPassword) ||
        this.getPwdStr(this.newPassword).length < 6 ||
        !this.getPwdStr(this.newPassword_confirm) ||
        this.getPwdStr(this.newPassword_confirm).length < 6
      ) {
        return this.$message.error("请输入新的提现密码");
      }
      if (
        this.getPwdStr(this.newPassword) !==
        this.getPwdStr(this.newPassword_confirm)
      ) {
        return this.$message.error("两次输入的新提现密码不一致，请重新输入");
      }
      // 发送请求
      this.user.oldPassword = this.getPwdStr(this.oldPassword);
      this.user.newPassword = this.getPwdStr(this.newPassword);
      this.user.newPassword_confirm = this.getPwdStr(this.newPassword_confirm);
      console.log(this.user, "pwd================================");
      changeWithdrawPwd(this.user).then(res => {
        console.log(res);
        if (res.status) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
        this.oldPassword = {};
        this.newPassword = {};
        this.newPassword_confirm = {};
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100%;
  background: #f9f7f8;
  .main {
    padding-left: 30px;
    padding-top: 20px;
    h2 {
      height: 63px;
      line-height: 86px;
      font-size: 16px;
    }
    .tis {
      height: 120px;
      border: 1px dashed #c8bc8c;
      background: #efedde;
      margin-bottom: 51px;
      h3 {
        line-height: 64px;
        padding-left: 15px;
        font-size: 16px;
        color: #9f9f9d;
      }
      p {
        line-height: 48px;
        color: #9f9f9d;
        font-size: 13px;
        padding-left: 95px;
      }
    }
    > div {
      line-height: 54px;
      color: #b3b3b3;
      margin-bottom: 34px;
      b {
        font-size: 13px;
        font-weight: normal;
        float: left;
      }
      input {
        width: 40px;
        height: 40px;
        margin-left: 10px;
        text-align: center;
        border: 1px solid #979596;
        border-radius: 5px;
      }
      span {
        width: 120px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size: 16px;
        color: #fff;
        display: inline-block;
        background: linear-gradient(#fdc937, #f37334);
        margin-left: 73px;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }
}
</style>
