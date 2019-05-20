<template>
  <div
    class="body"
    v-title="'注册'"
    @keydown.enter="goRegister"
    v-loading="loading"
    element-loading-background="rgba(255, 255, 255, 0.3)"
  >
    <div class="content">
      <div class="register">
        <div class="list">
          <router-link :to="{ name: 'home' }">
            <img src="/images/logo.png" alt="" draggable="false" />
          </router-link>
          <div class="registerContent">
            <ul>
              <li>
                <i class="iconfont">&#xe694;</i>
                <input
                  type="text"
                  placeholder="5~15个包含字母或数字组成的用户名"
                  name="username"
                  v-model="user.username"
                />
                <span class="usernameSpan" v-show="show">用户名已存在</span>
              </li>
              <li>
                <i class="iconfont">&#xe695;</i>
                <input
                  type="password"
                  placeholder="6~12个包含字母和数字的组合密码"
                  name="userpwd"
                  v-model="user.password"
                />
                <span class="userpwdSpan"></span>
              </li>
              <li>
                <i class="iconfont">&#xe695;</i>
                <input
                  type="password"
                  placeholder="再次输入密码"
                  name="reuserpwd"
                  v-model="user.password_confirm"
                />
                <span class="reuserpwdSpan"></span>
              </li>
              <li v-for="(FieldItem, i) in registerField" :key="i">
                <i class="iconfont optional" v-html="FieldItem.icon"></i>
                <input
                  v-if="FieldItem.formtype != 'select'"
                  :type="FieldItem.formtype"
                  :placeholder="
                    '请输入' +
                      FieldItem.name +
                      (FieldItem.isrequired ? '(必填)' : '(选填)')
                  "
                  v-model="user[FieldItem.field]"
                  :readonly="readOnly && FieldItem.field == 'xcode'"
                />
                <select v-else v-model="user[FieldItem.field]">
                  <option disabled value="">{{ FieldItem.tips }}</option>
                  <option
                    v-for="(item, i) in bankList"
                    :key="i"
                    :value="item.id"
                    >{{ item.name }}</option
                  >
                </select>
                <span></span>
              </li>
              <li v-show="otherBankShowFlag">
                <span>
                  其他银行
                </span>
                <input
                  type="text"
                  placeholder="请输入银行名称"
                  v-model="otherBankName"
                />
              </li>
              <li class="code">
                <i class="iconfont">&#xe697;</i>
                <input
                  type="text"
                  placeholder="验证码"
                  name="verificationcode"
                  v-model="user.verifyCode"
                />
                <b class="verificationcodeSpan" @click="changeCodeImg">
                  <img :src="codeImg" alt="" />
                </b>
              </li>
            </ul>
          </div>
          <div>
            <input type="checkbox" name id="keep" v-model="user.accept" />
            <label for="keep"></label>
            <span
              >我已看过并同意<b
                v-for="(item, i) in protocol"
                :key="i"
                @click="details(item.id)"
                >《{{ webName }}{{ item.title }}》</b
              ></span
            >
          </div>
          <span @click="goRegister">
            注册
          </span>
          <div>
            <router-link to="/login">
              已有账号，返回登录>
            </router-link>
          </div>
        </div>
        <a class="footer" target="_blank" :href="kefuGG">
          24小时客服在线
        </a>
      </div>
    </div>
    <div class="popup" v-show="showFlag">
      <div class="content">
        <span @click="close">x</span>
        <h3>{{ detail.title }}</h3>
        <div v-html="detail.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { registerBefore, register, ArticleDetail, settings } from "../../api";
import { Base64 } from "js-base64";
import BScroll from "better-scroll";
export default {
  name: "register",
  data() {
    return {
      show: false,
      codeImg: "",
      bankList: [],
      registerField: [],
      xcode: "",
      otherBankName: "",
      otherBankShowFlag: false,
      showFlag: false,
      detail: "",
      loading: false,
      webName: "",
      protocol: "",
      kefuGG: "",
      user: {
        username: "",
        password: "",
        password_confirm: "",
        verifyCode: "",
        accept: true,
        bankId: ""
      }
    };
  },
  created() {
    if (this.userInfo) {
      return this.$router.push({ name: "home" });
    }
    this.codeImg = "/api/auth/captcha";
    this.$nextTick(() => {
      document.getElementsByClassName("body")[0].style.minHeight =
        document.documentElement.clientHeight + "px";
      let wrapper = document.querySelector(".registerContent");
      new BScroll(wrapper, {
        mouseWheel: true
      });
    });
    registerBefore().then(res => {
      this.setXcode();
      let list = res.data.paramsList;
      this.registerField = list;
      for (let i = 0; i < list.length; i++) {
        let tempField = list[i].field;
        if (tempField === "xcode") {
          this.user[tempField] = this.xcode;
        } else {
          this.user[tempField] = "";
        }
      }
      this.bankList = res.data.bankList;
    });
    settings().then(res => {
      console.log(res.data, "========================================");
      if (res.status) {
        this.webName = res.data.webName;
        this.protocol = res.data.list.filter(
          item => item.title === "网络服务协议"
        );
        this.kefuGG = res.data.kefuGG;
      }
    });
  },
  computed: {
    ...mapGetters(["setting", "articles", "userInfo"]),
    readOnly() {
      return !!this.xcode;
    }
  },
  watch: {
    articles(newVal) {
      console.log(newVal, "setting111111111111111111111111");
    }
  },
  methods: {
    ...mapMutations(["SER_ARTICLE"]),
    details(id) {
      this.loading = true;
      ArticleDetail({ id: id }).then(res => {
        console.log(res);
        this.loading = false;
        if (res.status) {
          this.detail = res.data;
          this.showFlag = true;
        }
      });
    },
    close() {
      this.showFlag = false;
    },
    changeCodeImg() {
      this.user.verifyCode = "";
      this.codeImg = "/api/auth/captcha?" + Math.random();
    },
    bankName(bank) {
      for (let i = 0; i < this.bankList.length; i++) {
        let bankListOne = this.bankList[i];
        if (bankListOne.id === bank) {
          return bankListOne.name;
        }
      }
    },
    setXcode() {
      let xcode = this.$route.query.xcode || "";
      let cookieXcode = this.$cookies.get("xcode") || "";
      if (cookieXcode !== "" && /^[1-9]\d*$/.test(cookieXcode)) {
        xcode = cookieXcode;
      }
      if (xcode !== "" && !/^[1-9]\d*$/.test(xcode)) {
        xcode = "";
      }
      if (xcode !== "") {
        this.$cookies.set("xcode", xcode, "1D");
      }
      this.xcode = xcode;
    },
    goRegister() {
      if (!this.user.username) {
        return this.$message({
          type: "error",
          showClose: true,
          message: "用户名不能为空"
        });
      } else {
        if (!/^[a-zA-Z0-9_-]{5,15}$/.test(this.user.username)) {
          return this.$message({
            type: "error",
            showClose: true,
            message: "请按照要求填写用户名（5~15个字母或数字）"
          });
        }
      }
      if (!this.user.password || !this.user.password_confirm) {
        return this.$message({
          type: "error",
          showClose: true,
          message: "密码不能为空"
        });
      } else {
        if (
          !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,12}$/.test(
            this.user.password
          )
        ) {
          return this.$message({
            type: "error",
            showClose: true,
            message: "请按要求填写密码（6~12个包含字母和数字的组合）"
          });
        } else {
          if (this.user.password !== this.user.password_confirm) {
            return this.$message({
              type: "error",
              showClose: true,
              message: "两次输入的密码不同"
            });
          }
        }
      }
      if (!this.user.verifyCode) {
        return this.$message({
          type: "error",
          showClose: true,
          message: "请输入验证码"
        });
      }
      for (var i = 0; i < this.registerField.length; i++) {
        var item = this.registerField[i];
        if (item.isrequired) {
          if (!this.user[item.field]) {
            return this.$message("请输入" + item.name);
          } else {
            if (item.pattern) {
              if (!this.$_eval(item.pattern).test(this.user[item.field])) {
                return this.$message(item.errortips);
              }
            }
          }
        }
      }
      if (!this.user.accept) {
        return this.$message({
          type: "error",
          showClose: true,
          message: "请阅读并同意法律声明"
        });
      }
      let users = { ...this.user };
      if (this.otherBankShowFlag) {
        if (!/^([\u4e00-\u9fa5]){4,10}$/.test(this.otherBankName)) {
          return this.$message({
            type: "error",
            showClose: true,
            message: "请输入正确的开户银行名称"
          });
        }
        users.bankName = this.otherBankName;
      } else {
        users = {
          ...this.user,
          bankName: this.bankName(this.user.bankId)
        };
      }
      console.log(users, "注册数据--------------");
      register(users).then(res => {
        if (res.status) {
          this.$message.success(res.msg);
          this.$store.commit("SET_USER_INFO", res.data);
          this.$router.replace({
            path: "/user",
            query: {
              type: Base64.encode("Information"),
              firstName: Base64.encode("账户信息"),
              lastName: Base64.encode("个人信息")
            }
          });
        } else {
          this.$message({
            type: "error",
            showClose: true,
            message: res.msg
          });
          this.changeCodeImg();
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.body {
  background: url("/images/registered.jpg") no-repeat;
  -webkit-background-size: 100% 100%;
  background-size: cover;
  height: 100vh;
}
.content {
  .register {
    width: 426px;
    height: 767px;
    overflow: hidden;
    position: fixed;
    top: 82px;
    right: 395px;
    text-align: center;
    border-radius: 8px;
    .list {
      height: 700px;
      background-color: #222643;
      > a:first-child {
        display: block;
        text-align: center;
        img {
          margin-top: 27px;
          margin-bottom: 24px;
          width: 242px;
          height: 58px;
          display: inline-block;
        }
      }

      .registerContent {
        height: 440px;
        overflow: hidden;
        &::-webkit-scrollbar {
          width: 0;
        }
        li {
          height: 52px;
          line-height: 52px;
          text-align: left;
          padding-left: 40px;
          margin-top: 17px;
          position: relative;
          &:first-child {
            margin-top: 0;
          }
          i {
            color: #9a9a9a;
            font-size: 28px;
            position: absolute;
            left: 58px;
          }
          i.optional {
            font-size: 21px;
          }
          input {
            border: 0;
            border-radius: 8px;
            width: 344px;
            height: 52px;
            color: #000;
            font-size: 16px;
            line-height: 50px;
            padding-left: 60px;
          }
          span {
            position: absolute;
            right: 60px;
            font-size: 14px;
          }
          select {
            border: 0;
            border-radius: 8px;
            width: 344px;
            height: 52px;
            color: #000;
            font-size: 18px;
            line-height: 50px;
            padding-left: 60px;
            background-color: #fff;
          }
        }
        li.code {
          margin-bottom: 0;
          input {
            width: 233px;
            margin-right: 5px;
            float: left;
          }
          b.verificationcodeSpan {
            width: 105px;
            height: 52px;
            display: inline-block;
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      > span {
        display: inline-block;
        width: 346px;
        height: 58px;
        line-height: 58px;
        font-size: 17px;
        color: #fff;
        border-radius: 8px;
        text-align: center;
        background: linear-gradient(#fdc937, #f37334);
        cursor: pointer;
      }
      > div:nth-child(3) {
        width: 100%;
        color: #fff;
        line-height: 54px;
        overflow: hidden;
        font-size: 13px;
        input {
          display: none;
        }
        input + label {
          cursor: pointer;
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          text-align: center;
          line-height: 16px;
          background: linear-gradient(#fdc937, #f37334);
          border-radius: 3px;
          margin-right: 7px;
        }
        input:checked + label::before {
          content: "\2714";
          color: #fff;
        }
        span {
          display: inline-block;
          vertical-align: middle;
          b {
            font-weight: normal;
            cursor: pointer;
            &:hover {
              color: #ecae03;
            }
          }
        }
      }
      > div:nth-child(5) {
        overflow: hidden;
        a {
          color: #fff;
          float: right;
          padding-right: 41px;
          &:hover {
            color: #ecae03;
          }
        }
      }
    }
    .footer {
      display: block;
      height: 54px;
      line-height: 54px;
      color: #fff;
      font-size: 16px;
      background-color: #41456a;
      cursor: pointer;
      border-radius: 0 0 10px 10px;
    }
  }
}
.popup {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 3000;
  .content {
    background-color: #fff;
    width: 600px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 50px;
    height: 750px;
    overflow: hidden;
    border-radius: 10px;
    h3 {
      text-align: center;
      margin: 20px 0;
      font-size: 17px;
      font-weight: bold;
    }
    span {
      position: absolute;
      right: 20px;
      top: 10px;
      cursor: pointer;
      font-size: 25px;
    }
    div {
      overflow-y: scroll;
      max-height: 600px;
      font-size: 16px;
      color: #666;
    }
  }
}
@media screen and (max-width: 1400px) {
  .body {
    .content {
      .register {
        height: 720px;
        transform: scale(0.8);
        top: -50px;
        right: 30px;
        .list {
          height: 673px;
          .registerContent {
            height: 400px;
          }
        }
      }
    }
  }
  .popup {
    .content {
      width: 450px;
      padding: 30px;
      height: 550px;
      div {
        max-height: 430px;
        font-size: 12px;
        color: #666;
      }
    }
  }
}
</style>
