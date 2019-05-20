<template>
  <div class="body" @keydown.enter="login" v-title="'登录'">
    <div class="content">
      <div class="login">
        <router-link :to="{ name: 'home' }">
          <img src="/images/logo.png" alt="" draggable="false" />
        </router-link>
        <div>
          <i class="iconfont">&#xe694;</i>
          <input type="text" v-model="user.username" placeholder="用户名" />
        </div>
        <div>
          <i class="iconfont">&#xe695;</i>
          <input type="password" v-model="user.password" placeholder="密码" />
        </div>
        <div>
          <div>
            <i class="iconfont">&#xe697;</i>
            <input type="text" v-model="user.verifyCode" placeholder="验证码" />
          </div>
          <p @click="changeCodeImg">
            <img :src="codeImg" alt="" />
          </p>
        </div>
        <ul>
          <li>
            <div>
              <span>还没有账号？</span>
              <b @click="$router.push({ name: 'register' })">立即注册</b>
            </div>
            <div>
              <span>记住密码</span>
              <input type="checkbox" name id="keep" v-model="keep" />
              <label for="keep"></label>
            </div>
          </li>
          <li>
            <div @click="login">
              登录
            </div>
          </li>
        </ul>
        <a class="kf" :href="kefuGG" target="_blank">
          24小时客服在线
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { Base64 } from "js-base64";
import { goLogin, settings } from "@/api";
import { mapGetters } from "vuex";
export default {
  name: "login",
  data() {
    return {
      keep: false,
      codeImg: "",
      fromUrl: this.$route.query.redirect || "/home",
      kefuGG: "",
      user: {
        username: "",
        password: "",
        verifyCode: ""
      }
    };
  },
  created() {
    if (this.userInfo) {
      return this.$router.push({ name: "home" });
    }
    this.codeImg = "/api/auth/captcha";
    this.user.username = this.$cookies.get("username")
      ? Base64.decode(this.$cookies.get("username"))
      : "";
    if (this.$cookies.get("password")) {
      this.keep = true;
      this.user.password = Base64.decode(this.$cookies.get("password"));
    }
    this.$nextTick(() => {
      document.getElementsByClassName("body")[0].style.minHeight =
        document.documentElement.clientHeight + "px";
    });

    settings().then(res => {
      console.log(res.data, "========================================");
      if (res.status) {
        this.kefuGG = res.data.kefuGG;
      }
    });
  },
  computed: {
    ...mapGetters(["setting", "userInfo"])
  },
  methods: {
    changeCodeImg() {
      this.user.verifyCode = "";
      this.codeImg = "/api/auth/captcha?" + Math.random();
    },
    login() {
      if (!this.user.username) {
        return this.$message.error("用户名不能为空");
      }
      if (!this.user.password) {
        return this.$message.error("密码不能为空");
      }
      if (!this.user.verifyCode) {
        return this.$message.error("请输入验证码");
      }
      this.$cookies.set("username", Base64.encode(this.user.username), "7d");
      if (this.keep) {
        this.$cookies.set("password", Base64.encode(this.user.password), "7d");
      } else {
        if (this.$cookies.get("password")) this.$cookies.remove("password");
      }

      goLogin(this.user).then(res => {
        console.log(res, "登录信息---------------------------------------");
        if (res.status) {
          this.$store.commit("SET_USER_INFO", res.data);
          this.$router.replace({
            path: this.fromUrl
          });
        } else {
          this.changeCodeImg();
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.body {
  background: url("/images/registered.jpg") no-repeat;
  -webkit-background-size: 100% 100%;
  background-size: cover;
  height: 100vh;
}
.content {
  .login {
    position: fixed;
    top: 169px;
    right: 395px;
    width: 426px;
    height: 546px;
    background-color: #222643;
    border-radius: 8px;
    > a:first-child {
      display: block;
      margin: 40px auto 25px;
      text-align: center;
      img {
        width: 242px;
        height: 58px;
        display: inline-block;
      }
    }

    > div {
      overflow: hidden;
      margin: 0 40px 20px 40px;
      box-sizing: border-box;
      border: 1px solid #a8a8a8;
      height: 52px;
      line-height: 52px;
      font-size: 20px;
      border-radius: 5px;
      background-color: #fff;
      i {
        font-size: 22px;
        margin: 0 10px;
      }
      input {
        border: 0;
        height: 30px;
        width: 260px;
        margin-left: 10px;
        line-height: 30px;
      }
      &:nth-child(4) {
        border: none;
        background-color: #222643;
        margin-bottom: 14px;
        > div {
          box-sizing: border-box;
          border: 1px solid #a8a8a8;
          float: left;
          width: 235px;
          margin-right: 0;
          overflow: hidden;
          height: 52px;
          line-height: 52px;
          font-size: 20px;
          border-radius: 5px;
          background-color: #fff;
          input {
            width: 160px;
          }
        }
        p {
          float: left;
          width: 105px;
          height: 52px;
          overflow: hidden;
          margin-left: 5px;
          border-radius: 5px;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    ul {
      li {
        text-align: center;
        overflow: hidden;
        &:first-child {
          div {
            font-size: 13px;
            float: left;
            &:first-child {
              margin-left: 40px;
              span {
                color: #fff;
              }
            }
            b {
              font-weight: normal;
              color: #edad03;
              cursor: pointer;
              &:hover {
                color: white;
              }
            }
            &:last-child {
              float: right;
              margin-right: 40px;
              line-height: 16px;
              color: #fff;
              input {
                display: none;
              }
              input + label {
                cursor: pointer;
                display: inline-block;
                vertical-align: top;
                width: 16px;
                height: 16px;
                text-align: center;
                line-height: 16px;
                background: linear-gradient(#fdc937, #f37334);
                border-radius: 3px;
                margin-left: 8px;
              }

              input:checked + label::before {
                content: "\2714";
                color: #fff;
              }
            }
          }
        }
        &:last-child {
          margin-top: 25px;
          div {
            text-align: center;
            line-height: 58px;
            float: left;
            width: 346px;
            height: 58px;
            border-radius: 5px;
            color: white;
            box-sizing: border-box;
            cursor: pointer;
            background: linear-gradient(#fdc937, #f37334);
            font-size: 18px;
            margin-left: 40px;
          }
        }
      }
    }
    .kf {
      position: absolute;
      width: 100%;
      bottom: 0;
      cursor: pointer;
      line-height: 54px;
      text-align: center;
      background-color: #41456a;
      display: block;
      color: white;
      font-size: 16px;
      border-radius: 0 0 8px 8px;
    }
  }
}
@media screen and (max-width: 1400px) {
  .body {
    .content {
      .login {
        transform: scale(0.8);
        top: 100px;
        right: 30px;
      }
    }
  }
}
</style>
