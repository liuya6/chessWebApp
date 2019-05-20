<template>
  <div class="GameRecord">
    <div>
      <my-userTitle></my-userTitle>
    </div>
    <div
      class="content"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(255, 255, 255, 0.3)"
    >
      <div class="top">
        <ul>
          <li
            v-for="(game, i) in gameRecordList"
            :key="i"
            @click="changeGames(i, game.typeKey)"
            :class="{ on: game.typeKey === type }"
          >
            {{ game.name }}
          </li>
        </ul>
      </div>
      <div class="middle">
        <div v-show="childGameList">
          <p>游戏名称</p>
          <el-select v-model="chessId" placeholder="全部游戏">
            <el-option
              v-for="(item, i) in childGameList"
              :key="i"
              :label="item"
              :value="i"
            >
            </el-option>
          </el-select>
        </div>
        <div>
          <p>操作时间</p>
          <el-date-picker
            v-model="dataVal"
            type="datetimerange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions2"
            @change="changeData"
          >
          </el-date-picker>
        </div>
        <b @click="search">搜索</b>
      </div>
      <div class="btm">
        <div class="chess" v-if="modeType == 1">
          <ul>
            <li>时间</li>
            <li>单号</li>
            <li>游戏</li>
            <li>房间类型</li>
            <li>桌号</li>
            <li>抽水</li>
            <li>下注金额</li>
            <li>结果</li>
          </ul>
          <ul v-for="(item, i) in recordArr" :key="i">
            <li>{{ timestampToString(item.GameStartTime) }}</li>
            <li>{{ item.GameID }}</li>
            <li>{{ item.gameName }}</li>
            <li>{{ item.roomName }}</li>
            <li>{{ item.TableID }}</li>
            <li style="color: #248ce6">{{ item.Revenue }}</li>
            <li>{{ item.AllBet }}</li>
            <li :style="{ color: [item.Profit > 0 ? 'red' : 'green'] }">
              {{ item.Profit }}
            </li>
          </ul>
          <div v-show="noData" class="noData">
            <img src="/images/noData.png" alt="暂无数据" draggable="false" />
            <p>暂无记录</p>
          </div>
        </div>
        <div class="CQ9" v-else-if="modeType == 2">
          <ul>
            <li>时间</li>
            <li>单号</li>
            <li>游戏名称</li>
            <li>抽水</li>
            <li>下注金额</li>
            <li>结果</li>
          </ul>
          <ul v-for="(item, i) in recordArr" :key="i">
            <li>{{ timestampToString(item.createtime) }}</li>
            <li>{{ item.round }}</li>
            <li>{{ item.title }}</li>
            <li style="color: #248ce6">{{ item.rake || 0.0 }}</li>
            <li>{{ item.bet }}</li>
            <li :style="{ color: [item.win > 0 ? 'red' : 'green'] }">
              {{ item.win }}
            </li>
          </ul>
          <div v-show="noData" class="noData">
            <img src="/images/noData.png" alt="暂无数据" draggable="false" />
            <p>暂无记录</p>
          </div>
        </div>
        <div class="other" v-else>
          <ul>
            <li>时间</li>
            <li>单号</li>
            <li>游戏名称</li>
            <li>下注金额</li>
            <li>有效下注</li>
            <li>结果</li>
          </ul>
          <ul v-for="(item, i) in recordArr" :key="i">
            <li>{{ timestampToString(item.createtime) }}</li>
            <li>{{ item.round }}</li>
            <li>{{ item.title }}</li>
            <li>{{ item.bet }}</li>
            <li>{{ item.validbet }}</li>
            <li :style="{ color: [item.winloseamount > 0 ? 'red' : 'green'] }">
              {{ item.winloseamount }}
            </li>
          </ul>
          <div v-show="noData" class="noData">
            <img src="/images/noData.png" alt="暂无数据" draggable="false" />
            <p>暂无记录</p>
          </div>
        </div>
      </div>
      <div class="pageBox" v-show="total">
        <div class="btm-page">
          <span @click="firstPage(1)">首页</span>
          <el-pagination
            class="Page"
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
            :current-page="page"
          >
          </el-pagination>
          <span
            @click="firstPage(Math.ceil(total / pageSize))"
            style="margin-right: 10px;"
            >尾页</span
          >
          <span>共{{ Math.ceil(total / pageSize) }}页</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { GameRecordList, thirdRecord } from "../../api";
export default {
  name: "GameRecord",
  data() {
    return {
      loading: false,
      noData: false,
      pickerOptions2: {
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
      childGameList: [],
      recordArr: [],
      total: 0,
      modeType: 1,
      page: 1,
      pageSize: 15,
      type: "KaiYuan",
      chessId: ""
      // fromTime: "",
      // toTime: ""
    };
  },
  created() {
    console.log(
      this.gameRecordList,
      "游戏记录游戏列表----------------------------------------------------"
    );
    if (!this.gameRecordList) {
      this.initialGameList();
    } else {
      this.childGameList = this.gameRecordList[0].gameId;
    }
    this.thirdRecords();
    // this.getGame(this.typeKey);
  },
  computed: {
    ...mapGetters(["gameRecordList"])
  },
  watch: {
    type(newVal) {
      switch (newVal) {
        case "KaiYuan":
        case "LeYou":
          this.modeType = 1;
          break;
        case "CQ9":
          this.modeType = 2;
          break;
        default:
          this.modeType = 3;
          break;
      }
    }
  },
  methods: {
    ...mapMutations(["SET_GAME_RECORD_LIST"]),
    initialGameList() {
      GameRecordList().then(res => {
        this.childGameList = res.data[0].gameId;
        this.SET_GAME_RECORD_LIST(res.data);
      });
    },
    changeGames(i, typeKey) {
      console.log(i);
      this.childGameList = this.gameRecordList[i].gameId;
      this.type = typeKey;
      // this.fromTime = "";
      // this.toTime = "";
      this.page = 1;
      this.chessId = "";
      this.recordArr = "";
      this.total = 0;
      this.dataVal = [
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
      ];
      console.log(
        typeKey,
        this.childGameList,
        "childGameList--------------------------------------------"
      );
      this.thirdRecords();
    },
    // chessRecords() {
    //   this.loading = true;
    //   console.log({
    //     page: this.page,
    //     pageSize: this.pageSize,
    //     typeKey: this.type,
    //     chessId: this.chessId,
    //     fromTime: this.fromTime,
    //     toTime: this.toTime
    //   });
    //   chessRecord({
    //     page: this.page,
    //     pageSize: this.pageSize,
    //     typeKey: this.type,
    //     chessId: this.chessId,
    //     fromTime: this.fromTime,
    //     toTime: this.toTime
    //   }).then(res => {
    //     this.loading = false;
    //     console.log(res);
    //     if (res.status) {
    //       this.recordArr = res.data.list;
    //       this.total = res.data.total;
    //       if (!this.total) {
    //         this.noData = true;
    //       } else {
    //         this.noData = false;
    //       }
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   });
    // },
    thirdRecords() {
      console.log({
        page: this.page,
        pageSize: this.pageSize,
        typeKey: this.type,
        fromTime: this.fromTime,
        toTime: this.toTime,
        chessId: this.chessId
      });
      this.loading = true;
      thirdRecord({
        page: this.page,
        pageSize: this.pageSize,
        typeKey: this.type,
        fromTime: this.fromTime,
        toTime: this.toTime
      })
        .then(res => {
          this.loading = false;
          console.log(res);
          if (res.status) {
            this.recordArr = res.data.list;
            this.total = res.data.total;
            if (!this.total) {
              this.noData = true;
            } else {
              this.noData = false;
            }
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          console.log(err, "网络连接失败");
        });
    },
    changeData(val) {
      console.log(val);
      if (val) {
        this.fromTime = val[0];
        this.toTime = val[1];
      }
    },
    handleCurrentChange(page) {
      console.log(page);
      this.page = page;
      this.thirdRecords();
    },
    search() {
      console.log(this.type, this.chessId, this.fromTime, this.toTime);
      this.thirdRecords();
    },
    // submit() {
    //   if (this.childGameList) {
    //     this.chessRecords();
    //   } else {
    //     this.thirdRecords();
    //   }
    // },
    firstPage(num) {
      this.page = num;
      this.thirdRecords();
    }
  }
};
</script>

<style scoped lang="scss">
.GameRecord {
  min-height: 720px;
  .content {
    min-height: 500px;
    .top {
      ul {
        overflow: hidden;
        margin-top: 6px;
        li {
          width: 96px;
          height: 37px;
          line-height: 37px;
          text-align: center;
          float: left;
          background-color: #f0f0f0;
          font-size: 14px;
          margin-left: 10px;
          cursor: pointer;
          &:first-child {
            margin-left: 29px;
          }
        }
        li:hover {
          background: #c7bc8c;
        }
        .on {
          background-color: #c7bc8c;
        }
      }
    }
    .middle {
      overflow: hidden;
      margin: 15px 29px 8px;
      font-size: 14px;
      color: #a1a1a1;

      div {
        float: left;
        p {
          float: left;
          line-height: 38px;
          margin-right: 15px;
        }
        &:first-child {
          margin-right: 29px;
        }
      }
      b {
        float: right;
        text-align: center;
        line-height: 36px;
        color: white;
        width: 68px;
        height: 36px;
        background: linear-gradient(#fdc937, #f37334);
        font-size: 14px;
        border-radius: 5px;
        margin-top: 2px;
        cursor: pointer;
      }
    }
    .btm {
      .chess {
        ul {
          line-height: 37px;
          height: 37px;
          box-sizing: border-box;
          font-size: 14px;
          overflow: hidden;
          &:first-child {
            background-color: #f0f0f0;
          }
          li {
            float: left;
            text-align: center;
            &:nth-child(1) {
              width: 170px;
            }
            &:nth-child(2) {
              width: 200px;
            }
            &:nth-child(3) {
              width: 120px;
            }
            &:nth-child(4) {
              width: 150px;
            }
            &:nth-child(5) {
              width: 100px;
            }
            &:nth-child(6) {
              width: 100px;
            }
            &:nth-child(7) {
              width: 110px;
            }
            &:nth-child(8) {
              width: 100px;
            }
          }
        }
      }
      .CQ9 {
        ul {
          line-height: 37px;
          height: 37px;
          box-sizing: border-box;
          font-size: 14px;
          overflow: hidden;
          &:first-child {
            background-color: #f0f0f0;
          }
          li {
            float: left;
            text-align: center;
            &:nth-child(1) {
              width: 200px;
            }
            &:nth-child(2) {
              width: 220px;
            }
            &:nth-child(3) {
              width: 160px;
            }
            &:nth-child(4) {
              width: 180px;
            }
            &:nth-child(5) {
              width: 140px;
            }
            &:nth-child(6) {
              width: 140px;
            }
          }
        }
      }
      .other {
        ul {
          line-height: 37px;
          height: 37px;
          box-sizing: border-box;
          font-size: 14px;
          overflow: hidden;
          &:first-child {
            background-color: #f0f0f0;
          }
          li {
            float: left;
            text-align: center;
            &:nth-child(1) {
              width: 200px;
            }
            &:nth-child(2) {
              width: 220px;
            }
            &:nth-child(3) {
              width: 160px;
            }
            &:nth-child(4) {
              width: 180px;
            }
            &:nth-child(5) {
              width: 140px;
            }
            &:nth-child(6) {
              width: 140px;
            }
          }
        }
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
}
@media screen and (max-width: 1400px) {
  .GameRecord {
    .content {
      .middle {
        div {
          &:first-child {
            margin-right: 20px;
          }
        }
      }
      .btm {
        .chess {
          ul {
            font-size: 12px;
            li {
              &:nth-child(1) {
                width: 130px;
              }
              &:nth-child(2) {
                width: 185px;
              }
              &:nth-child(3) {
                width: 110px;
              }
              &:nth-child(4) {
                width: 120px;
              }
              &:nth-child(5) {
                width: 80px;
              }
              &:nth-child(6) {
                width: 75px;
              }
              &:nth-child(7) {
                width: 115px;
              }
              &:nth-child(8) {
                width: 80px;
              }
            }
          }
        }
        .CQ9 {
          ul {
            li {
              &:nth-child(1) {
                width: 180px;
              }
              &:nth-child(2) {
                width: 220px;
              }
              &:nth-child(3) {
                width: 130px;
              }
              &:nth-child(4) {
                width: 150px;
              }
              &:nth-child(5) {
                width: 110px;
              }
              &:nth-child(6) {
                width: 110px;
              }
            }
          }
        }
        .other {
          ul {
            li {
              &:nth-child(1) {
                width: 180px;
              }
              &:nth-child(2) {
                width: 220px;
              }
              &:nth-child(3) {
                width: 130px;
              }
              &:nth-child(4) {
                width: 150px;
              }
              &:nth-child(5) {
                width: 110px;
              }
              &:nth-child(6) {
                width: 110px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
