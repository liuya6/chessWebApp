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
      <!--      <ul class="maincontent" v-show="statArr">-->
      <!--        <li class="tr">-->
      <!--          统计记录-->
      <!--        </li>-->
      <!--        <li class="tr">-->
      <!--          <div>日期</div>-->
      <!--          <div>投注额</div>-->
      <!--          <div>有效投注</div>-->
      <!--          <div>输赢</div>-->
      <!--          <div>游戏分类</div>-->
      <!--        </li>-->
      <!--        <li class="tr" v-for="(item, i) in statArr" :key="i">-->
      <!--          <div>-->
      <!--            {{ item.date }}-->
      <!--          </div>-->
      <!--          <div>-->
      <!--            {{ item.list.allBet }}-->
      <!--          </div>-->
      <!--          <div>-->
      <!--            {{ item.list.cellScore }}-->
      <!--          </div>-->
      <!--          <div>-->
      <!--            {{ item.list.profit }}-->
      <!--          </div>-->
      <!--          <div v-if="third_Game_Lists">-->
      <!--            <el-select-->
      <!--              class="all"-->
      <!--              v-model="typeList[i]"-->
      <!--              placeholder="全部游戏"-->
      <!--              @change="changeType(item.date, i)"-->
      <!--            >-->
      <!--              <el-option-->
      <!--                v-for="(child, j) in thirdGameList"-->
      <!--                :key="j"-->
      <!--                :label="child.name"-->
      <!--                :value="child.typeKey"-->
      <!--              >-->
      <!--              </el-option>-->
      <!--            </el-select>-->
      <!--          </div>-->
      <!--        </li>-->
      <!--        <li class="tr">-->
      <!--          <div>-->
      <!--            总计-->
      <!--          </div>-->
      <!--          <div>{{ total.allBet }}</div>-->
      <!--          <div>{{ total.cellScore }}</div>-->
      <!--          <div>{{ total.profit }}</div>-->
      <!--        </li>-->
      <!--      </ul>-->
      <table border="1" cellspacing="0" cellpadding="0" v-show="statArr">
        <tr>
          <th colspan=" 5 ">统计记录</th>
        </tr>
        <tr>
          <td>日期</td>
          <td>投注额</td>
          <td>有效投注</td>
          <td>输赢</td>
          <td>游戏分类</td>
        </tr>
        <tr v-for="(item, i) in statArr" :key="i">
          <td>{{ item.date }}</td>
          <td>{{ item.list.allBet }}</td>
          <td>{{ item.list.cellScore }}</td>
          <td>{{ item.list.profit }}</td>
          <td v-if="third_Game_Lists">
            <el-select
              class="all"
              v-model="typeList[i]"
              placeholder="全部游戏"
              @change="changeType(item.date, i)"
            >
              <el-option
                v-for="(child, j) in thirdGameList"
                :key="j"
                :label="child.name.replace(/\余额/g, '游戏')"
                :value="child.typeKey"
              >
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>总计</td>
          <td>{{ total.allBet }}</td>
          <td>{{ total.cellScore }}</td>
          <td>{{ total.profit }}</td>
          <td></td>
        </tr>
      </table>

      <p v-show="statArr">
        *注：此记录显示的是已结算的投注记录，未记录的投注请到各平台投注历史查询。
      </p>
    </div>
  </div>
</template>

<script>
import { statCount, serchCount } from "../../api";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Statistical",
  data() {
    return {
      typeList: {},
      statArr: "",
      total: "",
      loading: false
    };
  },
  created() {
    this.initialTotal();
    if (!this.third_Game_Lists || !this.third_Game_Lists.length) {
      this.thirdGameLists();
    }
    console.log(
      this.third_Game_Lists,
      "11111111111111111111111111111111111111"
    );
  },
  computed: {
    ...mapGetters(["third_Game_Lists"]),
    thirdGameList() {
      let arr = {
        name: "全部游戏",
        typeKey: "0"
      };
      let gameList = [...this.third_Game_Lists];
      gameList.unshift(arr);
      console.log(gameList, "11111111111111112");
      return gameList;
    }
  },
  methods: {
    ...mapActions(["thirdGameLists"]),
    initialTotal() {
      this.loading = true;
      statCount().then(res => {
        this.loading = false;
        console.log(res, "历史统计");
        if (res.status) {
          this.statArr = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    serchCounts(type, i) {
      this.loading = true;
      serchCount(type).then(res => {
        this.loading = false;
        console.log(res, i);
        if (res.status) {
          if (res.data && res.data.allBet) {
            this.statArr[i].list = res.data;
          }
        }
      });
    },
    changeType(date, i) {
      console.log(date, this.typeList[i]);
      let parameter = {
        typeKey: this.typeList[i],
        date: date
      };
      this.serchCounts(parameter, i);
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
    background: #f9f7f8;
    position: relative;
    min-height: 500px;
    table {
      font-size: 14px;
      text-align: center;
      margin: 41px 50px 27px 50px;
      tr:nth-child(1),
      tr:nth-child(2) {
        background-color: #efedde;
        color: #666;
      }
      tr {
        line-height: 46px;
        td {
          width: 25%;
        }
      }
    }
    p {
      line-height: 50px;
      width: 100%;
      text-align: center;
      font-size: 13px;
      height: 50px;
      color: #666;
    }
  }
}
</style>
