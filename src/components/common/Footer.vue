<template>
  <div
    class="footer"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <ul class="footer_content w1400">
      <li>
        <a href="javascript:;">关于</a>
        <!--        <a href="javascript:;" @click="details(146)">关于我们</a>-->
        <!--        <a href="javascript:;" @click="details(276)">服务条款</a>-->
        <!--        <a href="javascript:;" @click="details(277)">取款帮助</a>-->
        <!--        <a href="javascript:;" @click="details(278)">存款帮助</a>-->
        <!--        <a href="javascript:;" @click="details(279)">用户权益保障措施</a>-->
        <a
          href="javascript:;"
          v-for="(item, i) in guanyuList"
          @click="details(item.id)"
          :key="i"
          >{{ item.title }}</a
        >
      </li>
      <li>
        <a href="javascript:;">联系</a>
        <a
          href="javascript:;"
          v-for="(item, i) in lianxiList"
          @click="details(item.id)"
          :key="i"
          >{{ item.title }}</a
        >
        <!--        <a href="javascript:;" @click="details(273)">联系我们</a>-->
        <a href="javascript:;">APP下载</a>
        <a href="javascript:;">
          <img
            class="renzheng"
            src="/newcode/common/appapi/appErweima/type/iphone"
            alt="APP下载二维码"
            draggable="false"
          />
        </a>
      </li>
      <li>
        <a href="javascript:;">帮助</a>
        <a
          href="javascript:;"
          v-for="(item, i) in helpList"
          @click="details(item.id)"
          :key="i"
          >{{ item.title }}</a
        >
        <!--        <a href="javascript:;" @click="details(275)">客服中心</a>-->
        <!--        <a href="javascript:;" @click="details(274)">常见问题</a>-->
        <!-- <a href="javascript:;">客服热线</a> -->
        <!-- <a href="javascript:;">4000-879-969</a> -->
        <!--        <a href="javascript:;">-->
        <!--          <img class="danwei" src="../../assets/danwei.png" alt="" />-->
        <!--        </a>-->
      </li>
      <li>
        <a href="javascript:;">版权与提示</a>
        <a href="javascript:;"
          >控制不良游戏 拒绝盗版游戏 注意自我保护 谨防上当受骗 适度游戏益脑
          沉迷游戏伤身 合理安排时间 享受健康生活
          本平台游戏仅适合18岁以上人群。</a
        >
        <a href="javascript:;">
          <span></span>
          2223棋牌所提供的产品和服务，是由澳门特别行政区 The Macao Special
          Administrative
          Region.授权和监管。选择我们，您将拥有可靠的资金保障和优质的服务。
        </a>
        <!--        <a href="javascript:;">-->
        <!--          <img class="gongan" src="../../assets/gongan.png" alt="" />-->
        <!--          <span>-->
        <!--            吉公网安备 22010202000453号-->
        <!--          </span>-->
        <!--        </a>-->
      </li>
      <!-- <a class="activeImg" href="javascript:;">
        <img src="../../assets/footer_icon.png" alt="" />
      </a> -->
      <a class="active" href="javascript:;">
        <img src="../../assets/renzheng.png" alt="" />
      </a>
    </ul>
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
import { ArticleDetail } from "../../api";
import { mapGetters } from "vuex";
export default {
  name: "my-Foot",
  data() {
    return {
      detail: "",
      showFlag: false,
      loading: false
    };
  },
  props: {
    article: Array
  },
  computed: {
    ...mapGetters(["articles"]),
    guanyuList() {
      if (this.articles) {
        return this.articles.filter(item => item.nodeId === 5);
      } else {
        return this.article.filter(item => item.nodeId === 5);
      }
    },
    lianxiList() {
      if (this.articles) {
        return this.articles.filter(item => item.nodeId === 6);
      } else {
        return this.article.filter(item => item.nodeId === 6);
      }
    },
    helpList() {
      if (this.articles) {
        return this.articles.filter(
          item => item.nodeId === 3 && item.title !== "网络服务协议"
        );
      } else {
        return this.article.filter(
          item => item.nodeId === 3 && item.title !== "网络服务协议"
        );
      }
    }
  },
  methods: {
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
    }
  }
};
</script>
<style lang="scss" scoped>
.footer {
  width: 100%;
  background: #22262a;
  overflow: hidden;
  .footer_content {
    display: flex;
    padding: 70px 30px;
    position: relative;
    flex-direction: row;
    li {
      width: 20%;
      a {
        width: 100%;
        color: #fff;
        display: inline-block;
        line-height: 26px;
        font-size: 13px;
        img {
          vertical-align: middle;
        }
        img.danwei {
          width: 58px;
          height: 58px;
        }
        img.renzheng {
          width: 140px;
          height: 140px;
          margin-top: 20px;
        }
        img.gongan {
          width: 16px;
          height: 16px;
          margin-top: 3px;
          float: left;
        }
        span {
          float: left;
        }
      }
      a:nth-of-type(1) {
        padding-bottom: 25px;
        cursor: text;
        font-size: 20px;
      }
    }
    li:nth-of-type(4) {
      width: 40%;
      a:first-child {
        padding-top: 0;
      }
      a {
        padding-top: 10px;
      }
    }
    a.activeImg {
      position: absolute;
      width: 58px;
      height: 58px;
      right: 240px;
      bottom: 120px;
      z-index: 100;
    }
    a.active {
      width: 83px;
      height: 30px;
      position: absolute;
      right: 30px;
      bottom: 120px;
      z-index: 100;
    }
    > a {
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.popup {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 3000;
  .content {
    background-color: #fff;
    width: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 50px;
    height: 70%;
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
      max-height: 500px;
      font-size: 16px;
      color: #666;
    }
  }
}

@media screen and (max-width: 1400px) {
  .footer {
    .footer_content {
      padding: 20px 0 0 20px;
      a {
        font-size: 12px !important;
      }
      a.active {
        bottom: 55px;
        right: 0;
      }
    }
  }
}
</style>
