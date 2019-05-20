<template>
  <div class="container">
    <my-userTitle></my-userTitle>
    <div class="main">
      <p>
        旧登录密码
        <el-input
          class="oldInput"
          placeholder="请输入旧密码"
          v-model="user.oldPassword"
          show-password
          minlength="8"
          maxlength="16"
        ></el-input>
      </p>
      <p>
        新登录密码
        <el-input
          class="oldInput"
          placeholder="请输入新密码"
          v-model="user.newPassword"
          show-password
          minlength="8"
          maxlength="16"
        ></el-input>
      </p>
      <p>
        新登录密码
        <el-input
          class="oldInput"
          placeholder="请再次输入新密码确认"
          v-model="user.newPassword_confirm"
          show-password
          minlength="8"
          maxlength="16"
        ></el-input>
      </p>
      <p>
        <span @click="changePwd">提交修改</span>
      </p>
      <div>
        <h3>温馨提示：为了提高账号的安全性，请勿设置过于简单的密码</h3>
        <p>(1)不能包含空格</p>
        <p>(2)8-16个字符</p>
        <p>(3)必须包含字母和数字</p>
      </div>
    </div>
  </div>
</template>

<script>
import { changeUserPwd } from "@/api";
export default {
  name: "LoginPwd",
  data() {
    return {
      user: {
        oldPassword: "",
        newPassword: "",
        newPassword_confirm: ""
      }
    };
  },
  methods: {
    changePwd() {
      if (!this.user.oldPassword) {
        return this.$message("请输入旧密码");
      }
      if (!this.user.newPassword || !this.user.newPassword_confirm) {
        return this.$message("请输入新密码");
      } else {
        if (
          !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,16}$/.test(
            this.user.newPassword
          )
        ) {
          return this.$message(
            "请按要求填写密码（8-16个包含字母和数字的组合）"
          );
        }
        if (this.user.newPassword !== this.user.newPassword_confirm) {
          return this.$message("两次输入密码不同");
        }
      }
      changeUserPwd(this.user).then(res => {
        this.$message(res.msg);
        if (res.status) {
          this.$router.go(-1);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background: #f9f7f8;
  > h2 {
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding-left: 30px;
    font-size: 16px;
    color: #333;
    border-bottom: 1px solid #e3ebf6;
  }
  .main {
    padding-left: 30px;
    font-size: 14px;
    padding-top: 20px;
    h2 {
      height: 63px;
      line-height: 86px;
      font-size: 16px;
    }
    > div {
      height: 220px;
      border: 1px dashed #c7bc8c;
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
        padding-left: 95px;
      }
    }
    > p {
      line-height: 44px;
      color: #999;
      margin-bottom: 44px;
      input {
        width: 322px;
        height: 42px;
        margin-left: 26px;
        font-size: 16px;
        padding-left: 15px;
        border: 1px solid #f0f0f0;
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
        margin-left: 98px;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }
}
</style>
