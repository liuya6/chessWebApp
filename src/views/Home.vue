<template>
  <div class="body" v-title="'首页'">
    <my-kefu @kefuOnline="kefuOnline"></my-kefu>
    <my-top :webGG="webGG"></my-top>
    <my-header></my-header>
    <div class="carousel">
      <el-carousel trigger="click">
        <el-carousel-item v-for="(item, i) in banner" :key="i">
          <div>
            <img :src="item.image" alt="首页轮播图" draggable="false" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="game_center w1400">
      <ul class="hotgame cl">
        <li
          v-for="(game, i) in hotGameList"
          :key="i"
          @click="playGame(game.link)"
        >
          <div class="gamenav">
            <img :src="game.bigImg" alt="game.id" draggable="false" />
            <p>
              {{ game.title }}
              <i>
                <img
                  :src="game.icon"
                  :class="[game.apiKey === 'KaiYuan' ? 'KaiYuan' : '']"
                  alt="game.id"
                />
              </i>
            </p>
          </div>
          <div class="shadowbox">
            <span>开始游戏</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="tv">
      <ul class="tvList w1400">
        <li v-for="(item, i) in homeList" :key="i">
          <div class="navImg">
            <img :src="item.large" alt="" draggable="false" />
          </div>
          <div class="smart">
            <img :src="item.smart" alt="item.id" draggable="false" />
            <div class="game">
              <p class="game_title">{{ item.title }}</p>
              <span class="game_name">{{ item.btmName }}</span>
            </div>
          </div>
          <div class="shadow">
            <span @click="goPlay(item.enName, item.list)">
              <i class="iconfont">&#xe69f;</i>
            </span>
          </div>
        </li>
      </ul>
    </div>
    <div class="accontcontent">
      <ul class="accont w1400">
        <li v-for="(accont, i) in accountList" :key="i">
          <img :src="accont.imgSrc" alt="" draggable="false" />
        </li>
      </ul>
    </div>
    <my-foot v-if="article" :article="article"></my-foot>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapMutations, mapGetters } from "vuex";
const accountList = [
  { id: 1, imgSrc: "/images/zhifu/01.png" },
  { id: 1, imgSrc: "/images/zhifu/02.png" },
  { id: 1, imgSrc: "/images/zhifu/06.png" },
  { id: 1, imgSrc: "/images/zhifu/05.png" },
  { id: 1, imgSrc: "/images/zhifu/04.png" },
  { id: 1, imgSrc: "/images/zhifu/03.png" }
];
const advertisementList = [
  {
    id: 1,
    large: "/images/chess.png",
    smart: "/images/chess01.png",
    title: "棋牌竞技",
    btmName: "CHESS"
  },
  {
    id: 2,
    large: "/images/realperson.png",
    smart: "/images/realperson01.png",
    title: "真人视讯",
    btmName: "LIVE"
  },
  {
    id: 3,
    large: "/images/electronic.png",
    smart: "/images/electronic01.png",
    title: "电子游艺",
    btmName: "ARCADE"
  }
];

import { initHome } from "../api";
export default {
  name: "home",
  data() {
    return {
      banner: [],
      accountList,
      hotGameList: [],
      select: -1,
      webGG: "",
      article: "",
      kefuOnline: ""
    };
  },
  created() {
    this.hallBefores();
    this.init();
  },
  mounted() {
    this.$nextTick(() => {
      let carousel = document.querySelector(".carousel");
      let nowHeight = carousel.clientHeight;
      let maxHeight =
        document.documentElement.clientHeight - carousel.offsetTop;
      if (nowHeight !== maxHeight) {
        carousel.style.height = maxHeight + "px";
      }
    });
  },
  computed: {
    ...mapGetters(["hallList"]),
    homeList() {
      let homeArr = [];
      for (let i = 0; i < advertisementList.length; i++) {
        let itemOne = advertisementList[i];
        let hallListOne = this.hallList[i];
        homeArr.push({
          ...itemOne,
          ...hallListOne
        });
      }
      console.log(homeArr);
      return homeArr;
    }
  },
  methods: {
    ...mapActions(["hallBefores"]),
    ...mapMutations(["SET_SETTING", "SER_ARTICLE"]),
    goPlay(enName, list) {
      this.$store.commit("SET_CURRENT_GAME", list);
      this.$router.push({ name: enName });
    },
    init() {
      initHome().then(res => {
        console.log(res.data);
        if (res.status) {
          this.banner = res.data.banner;
          this.hotGameList = res.data.recommend;
          this.webGG = res.data.setting.webGG;
          this.kefuOnline = res.data.setting.kefuGG;
          this.article = res.data.article;
          console.log(this.article, "11111111111111111111111111111111");
          this.SET_SETTING(res.data.setting);
          this.SER_ARTICLE(res.data.article);
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.body {
  width: 100%;
  .carousel {
    margin-top: 44px;
    height: 960px;
    .el-carousel {
      height: 100%;
      .el-carousel__container {
        .el-carousel__item {
          overflow: hidden;
          div {
            height: 100%;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
  .carousel_card {
    margin: 100px auto 45px;
    img {
      height: 100%;
    }
  }
  .accontcontent {
    height: 107px;
    background: #fbbd4c;
    .accont {
      height: 100%;
      display: flex;
      li {
        flex: 1;
        height: 100%;
        flex-direction: row;
        img {
          display: inline-block;
          margin-top: 29px;
          height: 48px;
        }
      }
    }
  }
  .game_center {
    background: url("/images/hotgame/hotgame.jpg") no-repeat top center;
    padding-top: 243px;
    .hotgame {
      height: 100%;
      li {
        width: 304px;
        height: 257px;
        transition: 0.5s;
        margin-right: 28px;
        margin-bottom: 36px;
        float: left;
        position: relative;
        cursor: pointer;
        div {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          border-radius: 10px;
          box-shadow: 1px 1px 10px #999;
          overflow: hidden;
          img {
            width: 100%;
            height: 194px;
          }
          p {
            flex: 1;
            text-align: center;
            font-size: 20px;
            color: #000;
            position: relative;
            line-height: 73px;
            i {
              display: block;
              position: absolute;
              right: 6px;
              z-index: 1;
              bottom: 13px;
              width: 35px;
              height: 15px;
              img {
                width: 100%;
                height: 100%;
              }
              img.KaiYuan {
                width: 28px !important;
                height: 18px !important;
              }
            }
          }
        }
        .shadowbox {
          width: 100%;
          height: 100%;
          display: none;
          position: absolute;
          left: 0;
          top: 0;
          text-align: center;
          background: rgba(0, 0, 0, 0.5);
          span {
            width: 106px;
            height: 34px;
            border-radius: 34px;
            margin: 123px auto;
            display: inline-block;
            line-height: 34px;
            text-align: center;
            color: #fff;
            background: -webkit-linear-gradient(
              #8e2ce3,
              #4c01e0
            ); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(
              #8e2ce3,
              #4c01e0
            ); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(
              #8e2ce3,
              #4c01e0
            ); /* Firefox 3.6 - 15 */
            background: linear-gradient(#8e2ce3, #4c01e0); /* 标准的语法 */
            font-size: 16px;
          }
        }
      }
      li:nth-child(4n) {
        margin-right: 0;
      }
      li:hover {
        transform: scale(1.1);
        .shadowbox {
          display: block;
        }
      }
    }
  }
  .tv {
    height: 529px;
    padding-top: 77px;
    padding-bottom: 85px;
    background: #000;
    .tvList {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      li {
        position: relative;
        &:hover {
          .smart {
            display: none;
          }
          .shadow {
            display: block;
          }
        }
        div.navImg {
          width: 100%;
          height: 100%;
          img {
            width: 400px;
            height: 313px;
          }
        }
        div.smart {
          width: 314px;
          height: 100px;
          background-color: #3f3f3f;
          position: absolute;
          left: 39px;
          bottom: -35px;
          overflow: hidden;
          border-radius: 10px;
          padding-top: 30px;
          z-index: 1;
          padding-bottom: 30px;
          text-align: center;
          pointer-events: none;

          img {
            width: 46px;
            height: 40px;
            float: left;
            margin-left: 80px;
            margin-right: 15px;
            display: inline-block;
          }
          .game {
            width: 93px;
            height: 42px;
            text-align: left;
            float: left;
            p.game_title {
              font-size: 20px;
              color: #fff;
              line-height: 20px;
            }
            span {
              font-size: 12px;
              line-height: 12px;
              color: #999;
            }
          }
        }
        div.shadow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          text-align: center;
          background: rgba(0, 0, 0, 0.5);
          filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f000000, endcolorstr=#7f000000);
          z-index: 3;
          cursor: pointer;
          display: none;

          span {
            width: 324px;
            height: 100px;
            text-align: center;
            margin-top: 113px;
            border-radius: 10px;
            display: inline-block;
            background: -webkit-linear-gradient(
              #8e2ce3,
              #4c01e0
            ); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(
              #8e2ce3,
              #4c01e0
            ); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(
              #8e2ce3,
              #4c01e0
            ); /* Firefox 3.6 - 15 */
            background: linear-gradient(#8e2ce3, #4c01e0); /* 标准的语法 */
            i {
              display: inline-block;
              padding-top: 10px;
              font-size: 53px;
              color: #fff;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1400px) {
  .body {
    .carousel {
      height: 650px;
    }
    .game_center {
      -webkit-background-size: 100%;
      background-size: 100%;
      .hotgame {
        li {
          width: 254px;
          height: 207px;
          transition: 0.5s;
          div {
            img {
              height: 164px;
            }
            p {
              font-size: 13px;
              line-height: 43px;
              i {
                bottom: 10px;
                width: 25px;
                height: 12px;
                img.KaiYuan {
                  width: 28px !important;
                  height: 17px !important;
                }
              }
            }
          }
          .shadowbox {
            span {
              margin: 85px auto;
            }
          }
        }
      }
    }
    .tv {
      height: 450px;
      padding-top: 77px;
      padding-bottom: 0;
      .tvList {
        li {
          div.navImg {
            img {
              width: 350px;
              height: 263px;
            }
          }
          div.smart {
            width: 264px;
            height: 80px;
            bottom: -40px;
            padding-top: 20px;
            img {
              margin-left: 60px;
            }
            .game {
              p.game_title {
                font-size: 16px;
                line-height: 26px;
              }
            }
          }
          div.shadow {
            span {
              width: 264px;
              height: 80px;
              line-height: 80px;
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              margin: auto;
              i {
                padding-top: 0;
                font-size: 43px;
              }
            }
          }
        }
      }
    }
    .accontcontent {
      height: 80px;
      .accont {
        li {
          line-height: 80px;
          img {
            display: inline-block;
            vertical-align: middle;
            margin-top: 0;
            height: 30px;
          }
        }
      }
    }
  }
}
</style>
