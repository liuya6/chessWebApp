<template>
  <div class="chess" @keydown.enter="searchGames" v-title="'棋牌'">
    <my-kefu></my-kefu>
    <my-top></my-top>
    <my-header header_black="true"></my-header>
    <div class="content">
      <div
        class="chess-content"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <div class="top">
          <dl class="cl">
            <dt>棋牌游艺</dt>
            <dd
              v-for="(item, i) in currentGame"
              :key="i"
              :class="{ on: gameDetail.typeKey === item.typeKey }"
              @click="changeGame(item.typeKey, item.title)"
            >
              <div>
                <img
                  :src="
                    `/images/game/${item.typeKey}-${
                      gameDetail.typeKey === item.typeKey ? 'on' : 'off'
                    }.png`
                  "
                  alt="x"
                  draggable="false"
                />
              </div>
              <i :class="{ show: gameDetail.typeKey === item.typeKey }"></i>
            </dd>
          </dl>
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
              v-for="(item, j) in gameList"
              :key="j"
              @click="playGame(item.link)"
            >
              <i>
                <img :src="item.img" alt="" draggable="false" />
              </i>
              <p>{{ item.title }}</p>
              <div>
                开始游戏
              </div>
            </li>
          </ul>
        </div>
        <div class="btm" v-show="total">
          <div class="btm-page">
            <span @click="firstPage(1)">首页</span>
            <el-pagination
              class="page"
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
  name: "Chess",
  data() {
    return {
      gameDetail: {
        typeKey: "KaiYuan",
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
    changeGame(type, title) {
      this.$store.commit("CHANGE_LOADING", 1);
      this.$store.commit("CHANGE_TITLE", title);
      this.gameDetail.typeKey = type;
      this.gameDetail.page = 1;
      this.hallTypes(this.gameDetail);
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
.chess {
  .content {
    margin-top: 135px;
    background: url("/images/game/chessBg.jpg") no-repeat #030c15;
    overflow: hidden;
    -webkit-background-size: 100%;
    background-size: 100%;
    img {
      height: 100%;
    }
    .chess-content {
      width: 1302px;
      min-height: 500px;
      margin: 284px auto 26px;
      .top {
        dl {
          height: 69px;
          background-color: rgba(0, 0, 0, 0.1);
          dt {
            float: left;
            width: 193px;
            line-height: 69px;
            box-sizing: border-box;
            border: 1px solid #3f3f3f;
            text-align: center;
            font-size: 24px;
            color: #bfb18a;
            background-color: #22262a;
          }
          dd {
            cursor: pointer;
            height: 69px;
            float: left;
            width: 294px;
            text-align: center;
            position: relative;
            div {
              width: 164px;
              height: 42px;
              margin: 13px auto 0;
              text-align: center;
              img {
                display: inline-block;
              }
            }
            i {
              border: 10px solid transparent;
              border-top-color: #fff;
              position: absolute;
              bottom: -20px;
              left: 50%;
              transform: translate(-50%);
              display: none;
            }
          }
          .on {
            background-color: #fff;
          }
        }
      }
      .middle {
        background-color: #22262a;
        padding: 0 50px;
        min-height: 500px;
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
            height: 243px;
            background-size: 100%;
            background: url("/images/game/bg-off.png") no-repeat;
            float: left;
            margin-left: 35px;
            margin-bottom: 40px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            &:nth-of-type(5n + 1) {
              margin-left: 0;
            }
            &:hover {
              background: url("/images/game/bg-on.png") no-repeat;
              div {
                top: 190px;
              }
              p {
                display: none;
              }
            }
            i {
              display: block;
              width: 150px;
              height: 150px;
              margin: 20px auto 0;
            }
            p {
              text-align: center;
              margin: 23px auto 0;
              font-size: 17px;
              color: #fff;
            }
            div {
              position: absolute;
              top: 300px;
              left: 50px;
              width: 106px;
              height: 34px;
              background-color: #333;
              text-align: center;
              line-height: 34px;
              font-size: 17px;
              color: #fff;
              cursor: pointer;
              border-radius: 34px;
              transition: 0.3s;
            }
          }
          .on {
            background: url("/images/game/bg-on.png") no-repeat;
          }
        }
      }
      .btm {
        background-color: #22262a;
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
        .page {
          float: left;
        }
      }
    }
  }
}
</style>
