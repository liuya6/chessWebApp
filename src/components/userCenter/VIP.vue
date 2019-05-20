<template>
  <div class="container">
    <div class="top">
      <my-userTitle></my-userTitle>
    </div>
    <div class="main">
      <div class="maincontent">
        <div class="logoBox">
          <img
            class="logo"
            src="../../assets/vip_03.png"
            alt="logo"
            draggable="false"
          />
          <span class="levelS">{{ grade }}</span>
        </div>
        <div class="progress">
          <span class="progress_line" :style="{ width: value + '%' }"></span>
        </div>
        <span class="dama">累计打码：{{ currentCode }}/{{ maxCode }}</span>
        <div class="level">
          <div class="nav">
            <div
              v-for="(item, index) in nav"
              :key="index"
              @click="addBorder(index)"
            >
              <span :class="[currentIndex == index ? 'active' : '']">
                {{ item.text }}
              </span>
              <span
                class="line"
                :class="[currentIndex == index ? 'action' : '']"
              ></span>
            </div>
          </div>
          <ul class="list" v-if="currentIndex == 0">
            <li>
              <h3>晋级礼金</h3>
              <p>{{ nowBonusUp }}元</p>
            </li>
            <li>
              <h3>周周俸禄</h3>
              <p>{{ nowBonusWeek }}元</p>
            </li>
            <li>
              <h3>月月俸禄</h3>
              <p>{{ nowBonusMonth }}元</p>
            </li>
          </ul>
          <ul class="list" v-if="currentIndex == 1">
            <li>
              <h3>晋级礼金</h3>
              <p>{{ nextBonusUp }}元</p>
            </li>
            <li>
              <h3>周周俸禄</h3>
              <p>{{ nextBonusWeek }}元</p>
            </li>
            <li>
              <h3>月月俸禄</h3>
              <p>{{ nextBonusMonth }}元</p>
            </li>
          </ul>
        </div>
        <div class="navcontent">
          <ul class="navList">
            <li v-for="(item, i) in lists" :key="i">
              <img :src="item.imgSrc" alt="" draggable="false" />
              <p>{{ item.title }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMember } from "../../api";
const nav = [{ text: "当前等级", id: 1 }, { text: "下一级", id: 2 }];
const lists = [
  { imgSrc: require("../../assets/vip_08.png"), title: "晋级礼金" },
  { imgSrc: require("../../assets/vip_10.png"), title: "周周俸禄" },
  { imgSrc: require("../../assets/vip_17.png"), title: "月月俸禄" },
  { imgSrc: require("../../assets/vip_06.png"), title: "荣升VIP" },
  { imgSrc: require("../../assets/vip_12.png"), title: "加速存取" },
  { imgSrc: require("../../assets/vip_14.png"), title: "经理客服" }
];
import { mapGetters } from "vuex";
export default {
  name: "VIP",
  data() {
    return {
      value: 0,
      nav,
      currentIndex: 0,
      lists,
      grade: "",
      currentCode: 0, //当前打码量
      maxCode: 0, //当前等级最大打码量
      nowBonusMonth: "", //当前等级月月俸禄
      nowBonusUp: "", //当前等级晋级礼金
      nowBonusWeek: "", //当前等级周周俸禄
      nextBonusMonth: "", //下一等级月月俸禄
      nextBonusUp: "", //下一等级晋级礼金
      nextBonusWeek: "" //下一等级周周俸禄
    };
  },
  methods: {
    addBorder: function(index) {
      this.currentIndex = index;
    },
    getMemberList: function() {
      getMember().then(res => {
        if (res.status) {
          this.currentCode = parseFloat(Number(this.userInfo.scoreTotal));
          this.grade = res.data.nowLevel.levelName;
          this.maxCode = parseInt(Number(res.data.nextLevel.minScore));
          this.nextMaxCode = parseInt(Number(res.data.nextLevel.minScore));
          this.value = (this.currentCode / this.maxCode) * 100;

          if (this.currentCode >= this.maxCode) {
            this.maxCode = this.nextMaxCode;
            this.grade = res.data.nextLevel.levelName;
          }
          this.nowBonusMonth = parseInt(res.data.nowLevel.bonusMonth);
          this.nowBonusUp = parseInt(res.data.nowLevel.bonusUp);
          this.nowBonusWeek = parseInt(res.data.nowLevel.bonusWeek);

          this.nextBonusMonth = parseInt(res.data.nextLevel.bonusMonth);
          this.nextBonusUp = parseInt(res.data.nextLevel.bonusUp);
          this.nextBonusWeek = parseInt(res.data.nextLevel.bonusWeek);
        }
      });
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    this.getMemberList();
  }
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  min-height: 720px;
  flex-direction: column;
  background: #f9f7f8;
  .main {
    flex: 1;
    background: #f9f7f8;
    .maincontent {
      width: 100%;
      overflow: hidden;
      background-color: #262626;
      text-align: center;
      .logoBox {
        position: relative;
        img.logo {
          margin-top: 53px;
        }
        span.levelS {
          position: absolute;
          top: 100px;
          left: 48.1%;
          z-index: 1;
          color: #fff;
          font-size: 14px;
        }
      }
      .navcontent {
        width: 100%;
        height: 120px;
        background: #f9f7f8;
        .navList {
          width: 870px;
          height: 120px;
          margin: 0 auto;
          display: flex;
          flex-direction: row;
          li {
            flex: 1;
            text-align: center;
            img {
              display: inline-block;
              width: 40px;
              height: 40px;
              margin-top: 22px;
              margin-bottom: 20px;
            }
            p {
              font-size: 14px;
            }
          }
        }
      }
      span.dama {
        font-size: 15px;
        color: #f8c400;
      }
      img {
        width: 80px;
        height: 80px;
        margin-bottom: 42px;
        display: inline-block;
      }
      .progress {
        width: 316px;
        height: 12px;
        border-radius: 12px;
        margin: 0 auto 19px;
        overflow: hidden;
        background-color: #161616;
        .progress_line {
          height: 12px;
          display: block;
          border-radius: 12px;
          background: #f5c500;
        }
      }
      .level {
        display: flex;
        flex-direction: column;
        background: url("../../assets/top.jpg") no-repeat top center;
        background-size: 100% 5%;
        margin-top: 87px;
        .nav {
          width: 100%;
          height: 67px;
          line-height: 67px;
          overflow: hidden;
          span {
            cursor: pointer;
          }
          div {
            width: 50%;
            color: #989898;
            display: block;
            float: left;
            text-align: center;
            font-size: 14px;
            position: relative;

            span.line {
              display: inline-block;
              position: absolute;
              bottom: 10px;
              left: 48%;
              width: 28px;
              height: 1px;
              background: #999;
            }
            .active {
              color: #fff;
            }
            .action {
              background: #fff !important;
              color: #fff;
            }
          }
        }
        .list {
          width: 894px;
          display: flex;
          justify-content: space-between;
          margin: 9px auto;
          padding-bottom: 30px;
          li:first-child {
            margin-left: 66px;
          }
          li:nth-child(3) {
            margin-right: 48px;
          }
          li {
            width: 198px;
            height: 94px;
            border: 1px solid #957441;
            float: left;
            h3 {
              line-height: 41px;
              font-size: 16px;
              margin-top: 5px;
              color: #815a00;
            }
            p {
              line-height: 43px;
              color: #fff;
              font-size: 13px;
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1400px) {
  .container .main .maincontent .logoBox span.levelS {
    left: 47.8%;
    font-size: 13px;
  }
  .container .main .maincontent .level .nav div span.line {
    left: 47%;
  }
}
</style>
