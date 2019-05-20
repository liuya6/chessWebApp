<template>
  <div class="Electronic" @keydown.enter="searchGames" v-title="'电子'">
    <my-kefu></my-kefu>
    <my-top></my-top>
    <my-header header_black="true"></my-header>
    <div class="content">
      <div
        class="game"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <div class="gameTab">
          <ul>
            <li
              v-for="(item, i) in currentGame"
              :key="i"
              :class="{ on: item.typeKey === gameDetail.typeKey }"
              @click="
                changeGame(item.typeKey, item.title, item.isHall, item.link)
              "
            >
              <i>
                <img :src="item.img" alt="x" />
              </i>
            </li>
            <li>
              更多游戏，敬请期待！
            </li>
          </ul>
        </div>
        <div class="middle">
          <div class="title">
            <span>{{ title }}-全部游戏（{{ total }}个）</span>
            <div>
              <input
                type="text"
                placeholder="请输入游戏名称"
                v-model="searchGameTitle"
              />
              <i class="iconfont" @click="searchGames">&#xe69e;</i>
            </div>
          </div>
          <ul>
            <li
              v-for="(item, i) in gameList"
              :key="i"
              @click="playGame(item.link)"
            >
              <i>
                <img :src="item.img" alt="" draggable="false" />
              </i>
              <p>{{ item.title }}</p>
              <div>
                <span>开始游戏</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="btm" v-show="total">
          <div class="btm-page">
            <span @click="firstPage(1)">首页</span>
            <el-pagination
              class="pages"
              background
              layout="prev, pager, next"
              :total="total"
              :page-size="gameDetail.pageSize"
              @current-change="handleCurrentChange"
              :current-page="gameDetail.page"
            >
            </el-pagination>
            <span
              @click="firstPage(Math.ceil(total / gameDetail.pageSize))"
              style="margin-right: 10px;"
              >尾页</span
            >
            <span>共{{ Math.ceil(total / gameDetail.pageSize) }}页</span>
          </div>
        </div>
      </div>
    </div>
    <my-foot></my-foot>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "Electronic",
  data() {
    return {
      gameDetail: {
        typeKey: "CQ9",
        pageSize: 15,
        page: 1
      },
      searchGameTitle: ""
    };
  },
  created() {
    this.SET_GAME_LIST("");
    this.$store.commit("CHANGE_LOADING", 1);
    this.hallTypes(this.gameDetail);
  },
  computed: {
    ...mapGetters(["currentGame", "gameList", "total", "title", "loading"])
  },
  methods: {
    ...mapActions(["hallTypes", "serchGames"]),
    ...mapMutations(["CHANGE_LOADING", "SET_GAME_LIST"]),
    changeGame(type, title, isHall, src) {
      if (isHall) {
        this.$store.commit("CHANGE_LOADING", 1);
        this.$store.commit("CHANGE_TITLE", title);
        this.gameDetail.typeKey = type;
        this.gameDetail.page = 1;
        this.hallTypes(this.gameDetail);
      } else {
        this.playGame(src);
      }
    },
    handleCurrentChange(num) {
      this.$store.commit("CHANGE_LOADING", 1);
      this.gameDetail.page = num;
      this.hallTypes(this.gameDetail);
    },
    firstPage(num) {
      this.$store.commit("CHANGE_LOADING", 1);
      this.gameDetail.page = num;
      this.hallTypes(this.gameDetail);
    },
    searchGames() {
      this.$store.commit("CHANGE_LOADING", 1);
      this.serchGames({
        typeKey: this.gameDetail.typeKey,
        title: this.searchGameTitle,
        pageSize: 15,
        page: 1
      });
    }
  }
};
</script>

<style scoped lang="scss">
.Electronic {
  .content {
    margin-top: 135px;
    background: url("/images/game/electronicBg.jpg") no-repeat #010e17;
    -webkit-background-size: 100%;
    background-size: 100%;
    overflow: hidden;
    .game {
      width: 1307px;
      min-height: 500px;
      margin: 274px auto 0;
      .gameTab {
        background: url("/images/game/electronicTab.png");
        min-height: 74px;
        ul {
          line-height: 74px;
          li {
            width: 214px;
            height: 51px;
            line-height: 54px;
            overflow: hidden;
            margin-left: 40px;
            display: inline-block;
            vertical-align: middle;
            background-color: #1f1f1f;
            text-align: center;
            cursor: pointer;
            i {
              display: inline-block;
              height: 40px;
              vertical-align: middle;
              img {
                transform: scale(1.5) translateY(-4px);
                display: inline-block;
                height: 100%;
              }
            }
            &:hover {
              background: linear-gradient(#8d2ee2, #4b00df);
            }
            &:last-child {
              background-color: #020c16;
              font-size: 13px;
              color: #939393;
              cursor: auto;
              &:hover {
                background: #020c16;
              }
            }
          }
          .on {
            background: linear-gradient(#8d2ee2, #4b00df);
          }
        }
      }
      .middle {
        background-color: #010e17;
        padding: 0 50px;
        .title {
          color: white;
          text-align: left;
          overflow: hidden;
          width: 100%;
          span {
            line-height: 92px;
            font-size: 18px;
          }
          div {
            float: right;
            margin-top: 30px;
            width: 211px;
            height: 37px;
            overflow: hidden;
            border-radius: 37px;
            background-color: #fff;
            line-height: 37px;
            padding-left: 20px;
            input {
              display: inline-block;
              vertical-align: top;
              height: 37px;
              width: 160px;
              border: none;
              font-size: 17px;
            }
            i {
              color: #333;
              cursor: pointer;
              font-size: 20px;
            }
          }
        }
        ul {
          overflow: hidden;
          border-bottom: 1px solid #727272;
          li {
            width: 211px;
            height: 273px;
            float: left;
            background-color: #333333;
            text-align: center;
            margin-left: 37px;
            margin-bottom: 35px;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            &:hover {
              div {
                display: block;
              }
            }
            &:nth-of-type(5n + 1) {
              margin-left: 0;
            }
            i {
              display: block;
              height: 209px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            p {
              line-height: 64px;
              font-size: 15px;
              color: #fff;
            }
            div {
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              right: 0;
              background-color: rgba(0, 0, 0, 0.6);
              display: none;
              span {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                margin: auto;
                width: 106px;
                height: 34px;
                border-radius: 34px;
                cursor: pointer;
                background: linear-gradient(#8f2de2, #4c01e0);
                color: white;
                font-size: 17px;
                line-height: 34px;
              }
            }
          }
        }
      }
      .btm {
        background-color: #010e17;
        height: 68px;
        overflow: hidden;
        text-align: center;
        padding-top: 20px;
        .btm-page {
          display: inline-block;
          overflow: hidden;
        }
        span {
          float: left;
          line-height: 32px;
          font-size: 16px;
          color: #6a6a6a;
          cursor: pointer;
        }
        .pages {
          float: left;
        }
      }
    }
  }
}
</style>
