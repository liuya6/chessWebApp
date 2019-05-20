<template>
  <div class="Withdraw">
    <div>
      <my-userTitle></my-userTitle>
    </div>
    <div
      class="content"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <b>在线取款</b>
      <div>
        <ul>
          <li>
            <span>账号：{{ userInfo.username }}</span>
            <span
              ><b>可用余额：</b><b>{{ userInfo.coin }}</b> CNY</span
            >
          </li>
          <li class="cl">
            <h3>银行卡：</h3>
            <div v-if="myBank.length" key="hasBank">
              <div @click.stop="changeCard">
                <i>
                  <img :src="`/images/${myBankCard.logo}`" alt="" />
                </i>
                <span>
                  {{ myBankCard.oldBankName }}
                </span>
                <span> 卡号：{{ bankNum(myBankCard.account) }} </span>
                <i class="iconfont">&#xe693;</i>
              </div>
              <dl :class="{ isChangeCard: changeCardFlag }">
                <dd
                  v-for="(item, i) in myBank"
                  :key="i"
                  @click="changeBankCard(item.id)"
                >
                  <i>
                    <img :src="`/images/${item.logo}`" alt="" />
                  </i>
                  <span>
                    {{ item.oldBankName }}
                  </span>
                  <span> 卡号：{{ bankNum(item.account) }} </span>
                </dd>
                <dd>
                  <p @click="addBankCard">添加银行卡<b>+</b></p>
                </dd>
              </dl>
            </div>
            <div v-else key="noBank"></div>
          </li>
          <li class="cl">
            <h3>提现金额：</h3>
            <el-input
              class="withdrawInput"
              v-model="bankWithdraw.amount"
            ></el-input>
            <span>元</span>
            <span>
              （<b>*</b>单次最小提现金额为<b>{{ cashMin }}</b
              >元，最大提现金额为<b>{{ cashMax }}</b
              >元）
            </span>
          </li>
          <li class="cl">
            <h3>取款密码：</h3>
            <div class="withdrawPwd">
              <input
                v-model="bankWithdraw.coinpwd[i]"
                type="tel"
                v-for="i in 6"
                :key="i"
                maxlength="1"
                style="-webkit-text-security:disc;text-security:disc;"
              />
            </div>
          </li>
        </ul>
        <b class="submit" @click="submit">提交申请 </b>
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import { nextInput } from "../../common/common";
import { mapActions, mapGetters } from "vuex";
import { getMyBank, withdraw, cashConfigs } from "../../api";
export default {
  name: "Withdraw",
  data() {
    return {
      loading: false,
      changeCardFlag: false,
      bankWithdraw: {
        bankId: "",
        amount: "",
        coinpwd: {}
      },
      cashMin: 0,
      cashMax: 0
    };
  },
  created() {
    document.addEventListener("click", () => {
      this.changeCardFlag = false;
    });
    console.log(this.myBank);
    if (!this.myBank || !this.myBank.length) {
      this.loading = true;
      getMyBank().then(res => {
        this.$store.commit("SET_MY_BANK", res.data);
        console.log(res.data, "我的银行卡");
        if (localStorage.getItem("bankId")) {
          this.bankWithdraw.bankId = localStorage.getItem("bankId");
        }
        if (res.data && res.data.length) {
          this.bankWithdraw.bankId = res.data[0].id;
        } else {
          this.$emit("type", "BankCard");
          this.$router.push({
            name: "user",
            query: {
              type: Base64.encode("BankCard"),
              firstName: Base64.encode("账户信息"),
              lastName: Base64.encode("银行卡管理"),
              addBank: 1
            }
          });
          this.$message.error("你还未绑卡哦");
        }
        this.loading = false;
      });
    } else {
      if (localStorage.getItem("bankId")) {
        this.bankWithdraw.bankId = localStorage.getItem("bankId");
      } else {
        this.bankWithdraw.bankId = this.myBank[0].id;
      }
    }
    cashConfigs().then(res => {
      if (res.status) {
        this.cashMax = res.data.cashMax;
        this.cashMin = res.data.cashMin;
      }
    });
  },
  mounted() {
    this.$nextTick(() => {
      nextInput(".withdrawPwd");
    });
  },
  computed: {
    ...mapGetters(["myBank", "userInfo"]),
    myBankCard() {
      for (let i = 0; i < this.myBank.length; i++) {
        let item = this.myBank[i];
        if (item.id == this.bankWithdraw.bankId) {
          return item;
        }
      }
      return false;
    },
    withdrawalPwd() {
      let list = "";
      for (let i in this.bankWithdraw.coinpwd) {
        let item = this.bankWithdraw.coinpwd[i];
        list += item;
      }
      return list;
    }
  },
  methods: {
    ...mapActions(["userDetails"]),
    changeCard() {
      this.changeCardFlag = !this.changeCardFlag;
    },
    changeBankCard(id) {
      this.bankWithdraw.bankId = id;
      localStorage.setItem("bankId", id);
    },
    addBankCard() {
      if (this.myBank.length >= 5) {
        return this.$message.error("最多只能绑定5张银行卡哦！");
      }
      console.log("11111111111111");
      this.$emit("type", "BankCard");
      this.$router.push({
        name: "user",
        query: {
          type: Base64.encode("BankCard"),
          firstName: Base64.encode("账户信息"),
          lastName: Base64.encode("银行卡管理"),
          addBank: 1
        }
      });
    },
    submit() {
      if (!this.bankWithdraw.amount) {
        return this.$message.error("请输入提现金额");
      }
      if (this.userInfo.coin <= 0) {
        return this.$message.error("账户余额为空");
      }
      if (this.cashMin && this.bankWithdraw.amount < parseFloat(this.cashMin)) {
        return this.$message.error("不得低于最小金额");
      }
      if (this.cashMax && this.bankWithdraw.amount > parseFloat(this.cashMax)) {
        return this.$message.error("不得高于最大金额");
      }
      if (this.userInfo.coin < this.bankWithdraw.amount) {
        return this.$message.error("账户余额不足");
      }
      if (!this.withdrawalPwd || this.withdrawalPwd.length < 6) {
        return this.$message.error("请输入提现密码");
      }
      this.loading = true;
      console.log(
        this.bankWithdraw,
        "提现数据-----------------------------------"
      );
      withdraw({
        bankId: this.bankWithdraw.bankId,
        amount: this.bankWithdraw.amount,
        coinpwd: this.withdrawalPwd
      }).then(res => {
        this.loading = false;
        this.bankWithdraw.coinpwd = {};
        if (res.status) {
          this.userDetails();
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.Withdraw {
  min-height: 720px;
  img {
    width: 100%;
    height: 100%;
  }
  .content {
    > b {
      display: block;
      width: 96px;
      height: 36px;
      background-color: #c7bc8c;
      color: white;
      text-align: center;
      line-height: 36px;
      font-size: 15px;
      margin-left: 31px;
      margin-top: 8px;
    }
    > div {
      border: 1px solid #f0f0f0;
      margin: 16px 30px 0 30px;
      ul {
        font-size: 14px;
        li {
          h3 {
            width: 132px;
            text-align: right;
            font-size: 16px;
            float: left;
          }
          &:first-child {
            margin: 0 30px;
            line-height: 58px;
            border-bottom: 1px solid #f0f0f0;
            span:first-child {
              margin-right: 45px;
            }
            b {
              color: #e60213;
            }
          }
          &:nth-child(2) {
            > h3 {
              margin-top: 28px;
            }
            > div {
              height: 48px;
              line-height: 48px;
              width: 406px;
              border: 1px solid #f0f0f0;
              margin-top: 15px;
              margin-bottom: 36px;
              float: left;
              border-left: 2px solid #ff0000;
              box-sizing: border-box;
              position: relative;
              cursor: pointer;
              > div,
              dl {
                i {
                  display: inline-block;
                  width: 20px;
                  height: 20px;
                  vertical-align: middle;
                  margin-left: 16px;
                  margin-right: 5px;
                  &:last-child {
                    position: absolute;
                    right: 12px;
                    top: 14px;
                    line-height: 18px;
                    font-size: 20px;
                  }
                }
                span {
                  &:nth-child(2) {
                    color: #333;
                  }
                  &:nth-child(3) {
                    color: #999;
                    float: right;
                    margin-right: 45px;
                  }
                }
              }
              > div,
              dd {
                position: relative;
              }
            }
            dl {
              position: absolute;
              left: -2px;
              top: 47px;
              width: 406px;
              box-sizing: border-box;
              cursor: pointer;
              z-index: 5;
              /*border: 1px solid #f0f0f0;*/
              background-color: #fff;
              border-top: none;
              dd {
                height: 0;
                transition: 0.2s;
                overflow: hidden;
                &:hover {
                  background-color: #000ec9;
                  span,
                  i {
                    color: white;
                  }
                }
                &:last-child {
                  p {
                    color: #999;
                    text-align: right;
                    padding-right: 47px;
                    b {
                      margin-left: 3px;
                    }
                  }
                  &:hover {
                    background-color: #fff;
                  }
                }
              }
            }
            .isChangeCard {
              border: 1px solid #f0f0f0;
              dd {
                height: 48px;
              }
            }
          }
          &:nth-child(3) {
            margin-bottom: 40px;
            b {
              color: #e50113;
            }
            h3 {
              margin-top: 5px;
            }
            input {
              width: 360px;
              height: 36px;
              border: 1px solid #f0f0f0;
              margin-right: 10px;
              text-align: right;
              padding-right: 20px;
            }
            .withdrawInput {
              width: 360px;
              margin-right: 10px;
              text-align: right;
              padding-right: 20px;
            }
          }
          &:nth-child(4) {
            h3 {
              margin-top: 7px;
            }
            input {
              width: 40px;
              height: 40px;
              margin-left: 10px;
              border: 1px solid #dfdfdf;
              text-align: center;
              border-radius: 5px;
              &:first-child {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }
  .submit {
    border-radius: 5px;
    margin-top: 30px;
    margin-left: 228px;
    margin-bottom: 30px;
    display: block;
    width: 96px;
    height: 36px;
    background: linear-gradient(#fdc937, #f37334);
    color: #fff;
    text-align: center;
    line-height: 36px;
    font-size: 15px;
    cursor: pointer;
  }
}
@media screen and (max-width: 1400px) {
  .Withdraw {
    .content {
      > div {
        ul {
          li {
            &:nth-child(3) {
              margin-bottom: 40px;
              .withdrawInput {
                width: 310px;
                margin-right: 0;
              }
              span {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
