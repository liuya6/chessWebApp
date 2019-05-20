<template>
  <div class="RealPerson" v-title="'真人'">
    <my-kefu></my-kefu>
    <my-top></my-top>
    <my-header header_black="true"></my-header>
    <div class="content">
      <div class="navcontent w1400" v-if="currentGame">
        <div
          :class="i ? 'right_img' : 'left_img'"
          v-for="(item, i) in currentGame"
          :key="i"
        >
          <div>
            <img class="firstImg" :src="item.img" alt="" />
            <p>
              <img :src="item.img" alt="" />
              <span>{{ item.title }}</span>
              <span class="goto" @click="playGame(item.link)">进入</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <my-foot></my-foot>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "RealPerson",
  data() {
    return {
      searchBarFixed: ""
    };
  },
  computed: {
    ...mapGetters(["currentGame"])
  },
  created() {
    console.log(
      this.currentGame,
      "11111111111111111111111111111111122222222222222222222"
    );
  }
};
</script>

<style lang="scss" scoped>
.content {
  overflow: hidden;
  margin-top: 135px;
  height: 909px;
  background: url("/images/game/personBg.jpg") no-repeat 0 0 #030c15;
  -webkit-background-size: 100%;
  background-size: 100%;
  .navcontent {
    height: 909px;
    position: relative;
    > div {
      width: 328px;
      height: 427px;
      position: absolute;
      border-radius: 0 0 328px 328px;
      top: 343px;
      cursor: pointer;
      overflow: hidden;
      background-size: 100% 100%;
      div {
        position: relative;
        width: 100%;
        height: 100%;
        > img.firstImg {
          width: 220px;
          height: 140px;
          display: block;
          position: absolute;
          top: 265px;
          left: 57px;
          z-index: 5;
          transform: scale(1.1);
        }
        p {
          position: absolute;
          width: 312px;
          height: 0;
          transition: 0.3s;
          bottom: 6px;
          left: 8px;
          text-align: center;
          background: rgba(0, 0, 0, 0.5);
          z-index: 3;
          border-radius: 0 0 312px 312px;
          img {
            width: 92px;
            height: 60px;
            margin-top: 8px;
            transform: scale(1.5);
            display: inline-block;
          }
          span:first-child {
            color: #fff !important;
          }
          span {
            width: 100%;
            display: inline-block;
            line-height: 34px;
            font-size: 20px;
            color: #fff;
          }
          span.goto {
            height: 28px;
            width: 110px;
            margin-top: 5px;
            font-size: 16px;
            line-height: 28px;
            background: #fff;
            color: #bf8300;
            border-radius: 5px;
          }
          span.goto:hover {
            background: red;
            color: #fff;
          }
        }
      }
    }
    > div:hover {
      .firstImg {
        display: none;
      }
      p {
        height: 160px;
      }
    }
    div.left_img {
      background: url("/images/game/girlLeft.png") no-repeat 0 0;
      left: 221px;
    }
    div.right_img {
      background: url("/images/game/girlRight.png") no-repeat 0 0;
      right: 276px;
    }
  }
}
@media screen and (max-width: 1400px) {
  .content {
    height: 700px;
    .navcontent {
      > div {
        top: 233px;
        transform: scale(0.8);
      }
      div.left_img {
        left: 160px;
      }
      div.right_img {
        right: 160px;
      }
    }
  }
}
</style>
