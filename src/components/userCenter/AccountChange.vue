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
      <div class="header">
        <div class="category">
          <span>账单类别</span>
          <el-select
            class="account"
            v-model="parameter.billType"
            placeholder="全部"
            minlength="8"
            maxlength
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="date">
          <span>操作类型</span>
          <el-date-picker
            v-model="dataVal"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="changeData"
          >
          </el-date-picker>
        </div>
        <span class="search" @click="search">搜索</span>
      </div>
      <ul class="maincontent">
        <li class="th">
          <div>时间</div>
          <div>帐变类型</div>
          <div>金额</div>
          <div>余额</div>
          <div>备注</div>
        </li>
        <li v-for="(item, i) in dataArr" :key="i">
          <div>{{ timestampToString(item.actionTime) }}</div>
          <div>{{ item.billName }}</div>
          <div>{{ item.coin }}</div>
          <div>{{ item.beforeCoin }}</div>
          <div>{{ item.info }}</div>
        </li>
      </ul>
      <div v-show="noData" class="noData">
        <img src="/images/noData.png" alt="暂无数据" draggable="false" />
        <p>暂无记录</p>
      </div>
      <div class="btm" v-show="total">
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
import { account } from "../../api";
export default {
  name: "AccountChange",
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      options: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "10",
          label: "充值"
        },
        {
          value: "20",
          label: "提现"
        },
        {
          value: "70",
          label: "额度转换"
        },
        {
          value: "80",
          label: "活动"
        },
        {
          value: "90",
          label: "其他"
        }
      ],
      dataVal: [
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          "00",
          "00",
          "00"
        ),
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() + 1,
          "00",
          "00",
          "00"
        )
      ],
      accountClasses: "",
      dataArr: [],
      loading: false,
      total: 0,
      noData: false,
      parameter: {
        client: 0,
        billType: "",
        page: 1,
        pageSize: 15
      }
    };
  },
  created() {
    this.initialArr();
  },
  methods: {
    initialArr() {
      this.loading = true;
      console.log(this.parameter, "账目记录请求参数-----------------");
      account(this.parameter).then(res => {
        this.loading = false;
        console.log(res, "账目记录返回数据---------------------------");
        if (res.status) {
          this.dataArr = res.data.list;
          this.total = res.data.total;
          if (!res.data.list.length) {
            this.noData = true;
          } else {
            this.noData = false;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleCurrentChange(page) {
      console.log(page);
      this.parameter.page = page;
      this.initialArr();
    },
    changeData(val) {
      console.log(val);
      if (val) {
        this.parameter.fromTime = val[0];
        this.parameter.toTime = val[1];
      }
    },
    search() {
      this.parameter.page = 1;
      console.log(this.parameter);
      this.initialArr();
    },
    firstPage(num) {
      this.parameter.page = num;
      this.initialArr();
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  .main {
    flex: 1;
    min-height: 720px;
    .header {
      height: 50px;
      line-height: 50px;
      display: flex;
      font-size: 14px;
      color: #999;
      flex-direction: row;
      background: #fff;
      padding-left: 30px;
      .category {
        span {
          margin-right: 10px;
        }
      }
      .date {
        width: 50%;
        height: 100%;
        margin-left: 124px;
        span {
          margin-right: 15px;
        }
      }
      span.search {
        color: #fff;
        width: 80px;
        text-align: center;
        line-height: 38px;
        height: 38px;
        margin-top: 6px;
        margin-left: 80px;
        display: block;
        float: right;
        font-size: 14px;
        border-radius: 5px;
        background: linear-gradient(#fdc937, #f37334);
        cursor: pointer;
      }
    }
    .maincontent {
      overflow: hidden;
      li.th {
        background-color: #f0f0f0;
      }
      li {
        line-height: 34px;
        height: 34px;
        font-size: 14px;
        color: #666;
        div {
          width: 20%;
          text-align: center;
          float: left;
        }
      }
    }
    .btm {
      margin-top: 30px;
      margin-left: 20px;
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
}
@media screen and (max-width: 1400px) {
  .container {
    .main {
      .header {
        .date {
          width: 500px;
          margin-left: 50px;
        }
        span.search {
          margin-left: 15px;
        }
      }
    }
  }
}
</style>
