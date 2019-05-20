<template>
  <div class="Activity" v-title="'优惠大厅'">
    <div>
      <my-kefu></my-kefu>
    </div>
    <my-top></my-top>
    <my-header header_black="true"></my-header>
    <div
      class="content"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="main w1400">
        <ul class="Tab">
          <li
            class="navitem"
            :class="{ active: selectIndex == i }"
            v-for="(nav, i) in navList"
            @click="tab(i, nav.type)"
            :key="i"
          >
            {{ nav.name }}
          </li>
        </ul>
        <ul class="maincontent">
          <li
            v-for="(activity, i) in activityArr"
            :key="i"
            @mouseover.stop="chose(i)"
            @mouseleave="mouseOut(i)"
            @click="handleShow(i)"
          >
            <img :src="activity.image" alt="activity.title" />
            <div class="shadow" v-show="selectValue == i">
              <span>
                查看详情
              </span>
            </div>
            <template>
              <div
                class="activityDetail"
                @click="stop"
                :class="[i === showTarget ? 'show' : 'hide']"
              >
                <div v-html="activity.content">{{ activity.content }}</div>
              </div>
            </template>
          </li>
        </ul>
        <div class="btm" v-show="total">
          <div class="btm-page">
            <span @click="firstPage(1)">首页</span>
            <el-pagination
              class="activityPage"
              background
              layout="prev, pager, next"
              :total="total"
              :page-size="parameter.pageSize"
              @current-change="handleCurrentChange"
              :current-page="parameter.page"
            >
            </el-pagination>
            <span
              @click="firstPage(Math.ceil(total / parameter.pageSize))"
              style="margin-right: 10px;"
              >尾页</span
            >
            <span>共{{ Math.ceil(total / parameter.pageSize) }}页</span>
          </div>
        </div>
      </div>
    </div>
    <my-foot></my-foot>
  </div>
</template>

<script>
import { activity, appllyActivity } from "../api";
const navList = [
  { id: 1, name: "全部活动", type: 0 },
  { id: 1, name: "棋牌活动", type: 1 },
  { id: 1, name: "真人活动", type: 2 },
  { id: 1, name: "电子活动", type: 3 }
];
export default {
  name: "activitys",
  data() {
    return {
      navList,
      selectIndex: 0,
      selectValue: 0,
      activityArr: [],
      showTarget: "",
      loading: false,
      parameter: {
        type: 0,
        page: 1,
        pageSize: 10
      },
      total: 0
    };
  },
  created() {
    this.init();
  },
  updated() {
    let that = this;
    let id;
    let ApplyBtn = document.querySelectorAll(".apply");
    for (let i = 0; i < ApplyBtn.length; i++) {
      let ApplyBtnOne = ApplyBtn[i];
      ApplyBtnOne.onclick = function() {
        id = this.getAttribute("id");
        if (!id) {
          id = this.getAttribute("data-id");
        }
        that.getApplication(id);
      };
    }
  },
  computed: {},
  methods: {
    init() {
      this.loading = true;
      console.log(this.parameter, "活动参数");
      activity(this.parameter).then(res => {
        if (res.status) {
          console.log(
            res.data,
            "活动列表！！！！！！！！！！！！！！！！！！！！！！！！"
          );
          this.loading = false;
          this.activityArr = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    tab(index, Type) {
      this.selectIndex = index;
      this.loading = true;
      console.log(Type);
      this.parameter.type = Type;
      this.parameter.page = 1;
      this.init();
    },
    handleCurrentChange(page) {
      this.parameter.page = page;
      this.init();
    },
    firstPage(num) {
      this.parameter.page = num;
      this.init();
    },
    chose(index) {
      this.selectValue = index;
    },
    mouseOut() {
      this.selectValue = -1;
    },
    handleShow(index) {
      this.showTarget = this.showTarget === index ? "" : index;
    },
    stop(event) {
      event.stopPropagation();
    },
    getApplication(id) {
      appllyActivity({ articleId: id })
        .then(res => {
          this.$message({
            message: res.msg,
            type: "success"
          });
        })
        .catch(err => {
          console.log(err);
          this.$message.error("活动申请失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  padding-top: 152px;
  background: url("/images/activitybg.jpg") no-repeat #272733;
  .main {
    ul.Tab {
      width: 785px;
      height: 42px;
      line-height: 42px;
      color: #9c9c9c;
      font-size: 18px;
      display: flex;
      flex-direction: row;
      background-color: #414143;
      margin: 32px auto;
      li {
        flex: 1;
        text-align: center;
        cursor: pointer;
      }
      li.active {
        color: #fff;
        background: -webkit-linear-gradient(
          #01a9f2,
          #3825fb
        ); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(
          #01a9f2,
          #3825fb
        ); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(
          #01a9f2,
          #3825fb
        ); /* Firefox 3.6 - 15 */
        background: linear-gradient(#01a9f2, #3825fb); /* 标准的语法 */
      }
    }
    ul.maincontent {
      width: 1104px;
      min-height: 500px;
      overflow: hidden;
      margin: 0 auto;
      li {
        text-align: center;
        margin-bottom: 19px;
        padding-top: 10px;
        border: 1px solid #f2f2f2;
        position: relative;
        background-color: #fff;
        img {
          display: inline-block;
          width: 1080px;
          height: 153px;
        }
        div.shadow {
          width: 100%;
          height: 174px;
          text-align: center;
          line-height: 174px;
          color: #fff;
          position: absolute;
          top: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0.5);
          span {
            cursor: pointer;
            display: inline-block;
            width: 130px;
            background: -webkit-linear-gradient(
              #fdc830,
              #f37335
            ); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(
              #fdc830,
              #f37335
            ); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(
              #fdc830,
              #f37335
            ); /* Firefox 3.6 - 15 */
            background: linear-gradient(#fdc830, #f37335); /* 标准的语法 */
            text-align: center;
            height: 36px;
            color: #fff;
            line-height: 36px;
            font-size: 17px;
            border-radius: 5px;
          }
        }
        .activityDetail {
          padding: 10px;
          background: #fff;
          overflow: hidden;
          .application {
            width: 97%;
            height: 50px;
            display: block;
            line-height: 50px;
            margin: 20px auto;
            background: red;
            color: #fff;
            border: 0;
            outline: none;
          }
          .gray {
            background: gray;
          }
        }
      }
    }
  }
  .hide {
    display: none;
  }
  .show {
    display: block;
  }
  .btm {
    height: 68px;
    overflow: hidden;
    text-align: center;
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
    .activityPage {
      float: left;
    }
  }
}
</style>
