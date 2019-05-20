<template>
  <div
    class="container"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-background="rgba(255, 255, 255, 0.3)"
  >
    <my-userTitle></my-userTitle>
    <div class="main" v-for="(item, i) in myBank" :key="i">
      <div>
        <img :src="`/images/${item.logo}`" alt="" draggable="false" />
      </div>
      <div>
        <p>{{ item.oldBankName }}</p>
        <span>{{ bankNum(item.account) }}</span>
      </div>
      <b>Card No.</b>
    </div>
    <div class="main" @click.stop="bindingBank">
      <span>+</span>
      <span>添加银行卡</span>
    </div>
    <div
      class="shadow"
      v-show="shadowFlag"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-background="rgba(0, 0, 0, 0.3)"
    >
      <div class="shadowBox">
        <h3>
          添加银行卡<span @click.stop="shadowFlag = !shadowFlag">关闭</span>
        </h3>
        <ul class="shadowContent">
          <li>
            <div>
              <span>持卡人姓名</span>
            </div>
            <el-input
              class="bankCardInput"
              placeholder="姓名不可修改，请谨慎填写"
              v-model="bankDetail.cardholder"
              :readonly="isReadOnly"
            ></el-input>
          </li>
          <li>
            <div>
              <span>选择银行</span>
            </div>
            <el-select
              class="bankSelect"
              v-model="bankDetail.bankName"
              placeholder="请选择开户银行"
            >
              <el-option
                v-for="(item, j) in bindingList"
                :key="j"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </li>
          <li v-show="otherFlag" class="other">
            <div>
              其他
            </div>
            <el-input
              class="bankCardInput"
              v-model="otherBank"
              placeholder="请输入开户银行名称"
            ></el-input>
          </li>
          <li>
            <div>
              <span>开户行地址</span>
            </div>
            <el-cascader
              size="medium"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
            >
            </el-cascader>
          </li>
          <li>
            <div>
              <span>银行卡号</span>
            </div>
            <el-input
              class="bankCardInput"
              placeholder="请再次输入银行卡号"
              v-model="cardNumber"
              maxlength="28"
            ></el-input>
          </li>
          <li>
            <div>
              <span>确认卡号</span>
            </div>
            <el-input
              class="bankCardInput"
              placeholder="请再次输入银行卡号"
              v-model="reCardNumber"
              maxlength="28"
            ></el-input>
          </li>
          <li v-if="!userInfo.coinPassword">
            <div>
              <span>资金密码</span>
            </div>
            <el-input
              placeholder="请输入提现密码"
              v-model="bankDetail.coinPassword"
              show-password
              maxlength="6"
            ></el-input>
          </li>
          <li v-if="!userInfo.coinPassword">
            <div>
              <span>确认密码</span>
            </div>
            <el-input
              placeholder="请输入提现密码"
              v-model="bankDetail.reCoinPassword"
              show-password
              maxlength="6"
            ></el-input>
          </li>
          <li>
            <span class="sure" @click="submit">
              确认
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { regionData, CodeToText } from "element-china-area-data";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { boundCard } from "@/api";
export default {
  name: "BankCard",
  data() {
    return {
      shadowFlag: false,
      isReadOnly: false,
      otherFlag: false,
      otherBank: "",
      cardNumber: "",
      reCardNumber: "",
      bankDetail: {
        cardholder: "",
        cardNumber: "",
        area: "",
        bankName: "",
        bankId: "",
        bankBranch: "",
        coinPassword: "",
        reCoinPassword: ""
      },
      options: regionData,
      selectedOptions: [],
      CodeToText
    };
  },
  created() {
    if (!this.myBank || !this.myBank.length) {
      // 我的银行卡
      this.myBanks();
    }
    if (!this.bindingList || !this.bindingList.length) {
      // 绑卡准备
      this.bindingBefores();
    }
    console.log(this.bindingList, "1212");
    if (this.$route.query.addBank) {
      this.shadowFlag = true;
    }
  },
  computed: {
    ...mapGetters(["bindingList", "myBank", "userInfo", "loading"])
  },
  watch: {
    myBank(newVal) {
      console.log(newVal, "myBank");
      if (newVal.length) {
        this.bankDetail.cardholder = newVal[0].username;
        this.isReadOnly = "readonly";
      }
    },
    cardNumber(newVal) {
      this.cardNumber = newVal
        .replace(/\s/g, "")
        .replace(/[^\d]/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ");
    },
    reCardNumber(newVal) {
      this.reCardNumber = newVal
        .replace(/\s/g, "")
        .replace(/[^\d]/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ");
    },
    "bankDetail.bankName": {
      handler(newVal) {
        console.log(newVal);
        if (newVal == "其他") {
          return (this.otherFlag = true);
        } else {
          return (this.otherFlag = false);
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(["bindingBefores", "myBanks"]),
    ...mapMutations(["CHANGE_LOADING"]),
    bankId(bank) {
      for (let i = 0; i < this.bindingList.length; i++) {
        let bankListOne = this.bindingList[i];
        if (bankListOne.name == bank) {
          return bankListOne.id;
        }
      }
      return 10000;
    },
    bindingBank() {
      if (this.myBank.length >= 5) {
        return this.$message.error("最多只能绑定5张银行卡哦！");
      }
      this.initalData();
      this.shadowFlag = !this.shadowFlag;
    },
    handleChange(val) {
      let areas = "";
      for (let i = 0; i < val.length; i++) {
        let item = val[i];
        areas += this.CodeToText[item];
      }
      console.log(areas);
      this.bankDetail.area = areas;
    },
    submit() {
      if (!this.bankDetail.cardholder) {
        return this.$message.error("请输入持卡人姓名");
      } else {
        if (!/^([\u4e00-\u9fa5]){2,7}$/.test(this.bankDetail.cardholder)) {
          return this.$message.error("请输入正确的姓名");
        }
      }
      if (!this.bankDetail.bankName) {
        return this.$message.error("请选择开户银行");
      }
      if (this.bankDetail.bankName === "其他") {
        if (!this.otherBank) {
          return this.$message.error("请输入开户银行名称");
        } else {
          if (!/^([\u4e00-\u9fa5]){4,10}$/.test(this.otherBank)) {
            return this.$message.error("请输入正确的开户银行名称");
          }
        }
      }
      if (!this.bankDetail.area) {
        return this.$message.error("请选择开户地区");
      }
      if (!this.cardNumber || !this.reCardNumber) {
        return this.$message.error("请输入银行卡号");
      } else {
        this.cardNumber = this.cardNumber.replace(/\s*/g, "");
        this.reCardNumber = this.reCardNumber.replace(/\s*/g, "");
        if (!/\d{15}|\d{28}/.test(this.cardNumber)) {
          return this.$message.error("请输入正确的银行卡号");
        }
        if (this.cardNumber !== this.reCardNumber) {
          return this.$message.error("两次输入的银行卡号不同");
        }
      }
      if (!this.userInfo.coinPassword) {
        if (!this.bankDetail.coinPassword) {
          return this.$message.error("请设置提现密码");
        } else {
          if (this.bankDetail.coinPassword !== this.bankDetail.reCoinPassword) {
            return this.$message.error("两次输入的密码不同");
          }
        }
      }
      if (this.otherBank) {
        this.bankDetail.bankName = this.otherBank;
      }
      this.bankDetail.bankId = this.bankId(this.bankDetail.bankName);
      this.bankDetail.cardNumber = this.cardNumber.replace(/\s*/g, "");
      console.log(this.bankDetail);
      this.$store.commit("CHANGE_LOADING", 1);
      boundCard(this.bankDetail).then(res => {
        console.log(res);
        this.$store.commit("CHANGE_LOADING", 0);
        this.$message.info(res.msg);
        if (res.status) {
          this.shadowFlag = false;
          this.myBanks();
        }
      });
    },
    initalData() {
      this.bankDetail.bankName = "";
      this.selectedOptions = [];
      this.cardNumber = "";
      this.reCardNumber = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 720px;
  position: relative;
  background-color: #f9f7f8;
  .main {
    margin-left: 20px;
    margin-top: 30px;
    width: 320px;
    height: 134px;
    color: #9b9b9b;
    text-align: center;
    line-height: 134px;
    background: url("/images/bankcard-bg.png") no-repeat bottom #f0f0f0;
    border-radius: 10px;
    cursor: pointer;
    float: left;
    position: relative;
    > span {
      &:first-child {
        font-size: 26px;
      }
      &:last-child {
        font-size: 20px;
      }
    }
    div {
      float: left;
      &:first-child {
        display: inline-block;
        width: 70px;
        height: 70px;
        margin-top: 30px;
        margin-left: 30px;
        line-height: 80px;
        img {
          width: 100%;
          display: inline-block;
          vertical-align: middle;
        }
      }
      &:nth-child(2) {
        font-size: 20px;
        line-height: 0;
        text-align: left;
        margin-top: 35px;
        margin-left: 10px;
        p {
          line-height: 40px;
          color: #333;
          font-size: 17px;
        }
        span {
          line-height: 30px;
          color: #656565;
        }
      }
    }
    b {
      line-height: 0;
      position: absolute;
      right: 10px;
      top: 10px;
      color: #605aa4;
      font-size: 15px;
      font-weight: normal;
    }
  }
  .shadow {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1500;
    .shadowBox {
      width: 588px;
      max-height: 520px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      border-radius: 10px;
      flex-direction: column;
      border: 1px solid #a2a2a2;
      background: #fff;
      h3 {
        height: 46px;
        padding-left: 15px;
        padding-right: 20px;
        line-height: 46px;
        font-size: 17px;
        background: #f0f0f0;
        border-bottom: 1px solid #a2a2a2;
        span {
          float: right;
          font-size: 16px;
          color: #9b9b9b;
          cursor: pointer;
        }
      }
      .shadowContent {
        flex: 1;
        font-size: 13px;
        li:first-child {
          margin-top: 24px;
        }
        li {
          height: 40px;
          line-height: 40px;
          overflow: hidden;
          margin-top: 10px;
          .el-cascader {
            margin-left: 0 !important;
            width: 384px;
          }
          .el-input {
            width: 384px;
          }
          .other {
            overflow: hidden;
            margin-right: 0;
            .el-input {
              width: 384px;
              margin-right: 0;
            }
            span {
              float: left;
              margin-right: 16px;
            }
          }
          &:last-child {
            margin-bottom: 20px;
          }
          > div {
            float: left;
            text-align: right;
            margin-right: 24px;
            width: 20%;
          }
          .bankCardInput {
            width: 384px;
          }
          .bankSelect {
            width: 384px;
          }
          .sure {
            width: 120px;
            height: 36px;
            font-size: 13px;
            line-height: 36px;
            text-align: center;
            color: #fff;
            cursor: pointer;
            display: inline-block;
            background: linear-gradient(#fdc937, #f37334);
            border-radius: 5px;
            margin-left: 140px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1400px) {
  .container {
    .main {
      margin-left: 10px;
      margin-top: 20px;
      width: 285px;
      > span {
        &:first-child {
          font-size: 20px;
        }
        &:last-child {
          font-size: 17px;
        }
      }
      div {
        float: left;
        &:first-child {
          width: 50px;
          height: 50px;
          margin-left: 20px;
        }
        &:nth-child(2) {
          font-size: 16px;
          p {
            line-height: 40px;
            color: #333;
            font-size: 17px;
          }
          span {
            line-height: 30px;
            color: #656565;
          }
        }
      }
    }
  }
}
</style>
