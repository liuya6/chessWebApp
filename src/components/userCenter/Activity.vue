<template>
  <div class="container">
    <div>
      <my-userTitle></my-userTitle>
    </div>
    <div
      class="main"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(255, 255, 255, 0.3)"
    >
      <ul class="maincontent" v-show="title">
        <li class="th">
          <div>活动名称</div>
          <div>活动状态</div>
          <div class="beizhu">备注</div>
          <div class="date">时间</div>
        </li>
        <li class="listItem" v-for="(item, index) in activityList" :key="index">
          <div>{{ item.title }}</div>
          <div>{{ item.status | changeStatus }}</div>
          <div>{{ item.info | changeInfo }}</div>
          <div>{{ timestampToString(item.createtime) }}</div>
        </li>
      </ul>
      <div v-show="noData" class="noData">
        <img src="/images/noData.png" alt="暂无数据" draggable="false" />
        <p>暂无记录</p>
      </div>
      <div class="pageBox" v-show="total">
        <div class="btm-page">
          <span @click="firstPage(1)">首页</span>
          <el-pagination
            class="Page"
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
</template>

<script>
import { activityApplyList } from "../../api";
import { mapGetters } from "vuex";

export default {
  name: "Activity",
  data() {
    return {
      activityList: [],
      noData: false,
      title: "",
      total: 0,
      parameter: {
        pageSize: 10,
        page: 1
      }
    };
  },
  created() {
    this.$store.commit("CHANGE_LOADING", 1);
    this.init(this.parameter);
  },
  computed: {
    ...mapGetters(["userInfo", "loading"])
  },
  methods: {
    init() {
      activityApplyList(this.parameter).then(res => {
        console.log(res.data);
        if (res.status) {
          this.$store.commit("CHANGE_LOADING", 0);
          this.activityList = res.data.list;
          this.total = res.data.total;
          if (!this.activityList.length) {
            this.noData = true;
          } else {
            this.noData = false;
            this.title = true;
          }
        }
      });
    },
    handleCurrentChange(num) {
      this.$store.commit("CHANGE_LOADING", 1);
      this.parameter.page = num;
      this.init(this.parameter);
    },
    firstPage(num) {
      this.$store.commit("CHANGE_LOADING", 1);
      this.parameter.page = num;
      this.init(this.parameter);
    }
  },
  filters: {
    changeStatus: function(value) {
      switch (value) {
        case 0:
          return "待处理";
        case 1:
          return "已处理";
        default:
          return "已拒绝";
      }
    },
    changeInfo(value) {
      if (!value) {
        return "暂无备注";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 720px;
  display: flex;
  flex-direction: column;
  background: #f9f7f8;
  .main {
    flex: 1;
    background: #f9fbfd;

    .maincontent {
      min-height: 100px;
      margin: 37px 30px;
      border: 1px solid #e3ebf6;

      li:first-child {
        font-size: 16px;

        .beizhu,
        .date {
          color: #666666;
        }
      }

      li {
        height: 46px;
        font-size: 14px;
        color: #666666;
        border-bottom: 1px solid #e3ebf6;
        line-height: 46px;

        div {
          float: left;
          height: 100%;
          text-align: center;
          border-right: 1px solid #e3ebf6;
        }

        div:first-child {
          width: 146px;
        }

        div:nth-of-type(2) {
          width: 96px;
        }

        div:nth-of-type(3) {
          width: 434px;
          color: #999999;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        div:last-child {
          width: 152px;
          color: #999999;
          border: 0;
        }
      }

      li:last-child {
        border-bottom: 0;
      }
    }

    .noData {
      margin-top: 50px;
      text-align: center;
      font-size: 15px;
      img {
        display: inline-block;
      }
      p {
        margin-top: 20px;
      }
    }
    .pageBox {
      margin-top: 15px;
      margin-left: 20px;
      margin-bottom: 20px;
      text-align: center;
      .btm-page {
        display: inline-block;
        overflow: hidden;
        span {
          float: left;
          line-height: 32px;
          font-size: 16px;
          cursor: pointer;
        }
        .Page {
          float: left;
        }
      }
    }
  }
}
</style>
