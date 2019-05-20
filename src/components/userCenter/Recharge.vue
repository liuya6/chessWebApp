<template>
  <div class="Recharge">
    <div>
      <my-userTitle></my-userTitle>
    </div>
    <div class="content">
      <div class="top">
        <ul>
          <li
            v-for="(item, i) in rechargeList"
            :key="i"
            :class="{ on: item.type === type }"
            @click="changeTab(item.type)"
          >
            {{ item.title }}
          </li>
        </ul>
      </div>
      <div
        v-if="isPayFlag"
        class="pay"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.3)"
      >
        <div class="left">
          <dl v-if="payWays">
            <dt>
              转账银行信息
            </dt>
            <dd>
              <span>银行：</span>
              <span>{{ order.rechargeMethod.rechargeName }}</span>
            </dd>
            <dd>
              <span>收款人：</span>
              <span>{{ order.rechargeMethod.username }}</span>
              <span
                v-clipboard:copy="order.rechargeMethod.username"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                >复制</span
              >
            </dd>
            <dd>
              <span>帐号：</span>
              <span>{{ order.rechargeMethod.account }}</span>
              <span
                v-clipboard:copy="order.rechargeMethod.account"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                >复制</span
              >
            </dd>
            <dd>
              <span>开户网点：</span>
              <span>{{ order.rechargeMethod.bankname }}</span>
              <span
                v-clipboard:copy="order.rechargeMethod.bankname"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                >复制</span
              >
            </dd>
          </dl>
          <div v-else>
            <h3>扫描以下二维码进行支付</h3>
            <img
              :src="order.rechargeMethod.image"
              alt="支付二维码"
              draggable="false"
            />
          </div>
        </div>
        <div class="right">
          <dl class="bank" v-if="payWays">
            <dt>
              完善充值信息
            </dt>
            <dd>
              <span>充值单号：</span>
              <span>{{ order.recharge.rechargeId }}</span>
            </dd>
            <dd>
              <span>存款人姓名：</span>
              <input
                type="text"
                placeholder="请输入存款人姓名"
                v-model="payAccountName"
              />
            </dd>
            <dd>
              <span>存款金额：</span>
              <input type="text" v-model="amount" />
            </dd>
            <dd>
              <span>存款时间：</span>
              <input
                type="text"
                readonly="readonly"
                :placeholder="timestampToString(order.recharge.actionTime)"
              />
            </dd>
            <dd>
              <span>存款方式</span>
              <el-select
                v-model="bankPos"
                placeholder="请选择"
                style="width: 212px;"
              >
                <el-option
                  v-for="item in options"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </dd>
            <dd>
              <span @click="prev">上一步</span>
              <span @click="submit">提交订单</span>
            </dd>
          </dl>
          <div v-else>
            <h3>完善充值信息</h3>
            <ul>
              <li>
                <span>充值单号：</span>
                <span>{{ order.recharge.rechargeId }}</span>
              </li>
              <li>
                <span>商户名称：</span>
                <span>{{ order.rechargeMethod.ext2 }}</span>
              </li>
              <li>
                <span>存款人姓名：</span>
                <input
                  type="text"
                  placeholder="请输入存款人姓名"
                  v-model="payAccountName"
                />
              </li>
              <li>
                <span>存款金额：</span>
                <input type="text" v-model="amount" />
              </li>
              <li>
                <span>存款时间：</span>
                <input
                  type="text"
                  readonly="readonly"
                  :placeholder="timestampToString(order.recharge.actionTime)"
                />
              </li>
              <li>
                <span @click="prev">上一步</span>
                <span @click="submit">提交订单</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        v-else
        class="middle"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.3)"
      >
        <ul>
          <li v-for="(item, j) in TabList" :key="j">
            <h3>{{ item.rechargeName }}</h3>
            <span>{{ item.desc }}</span>
            <div>
              <span>充值金额：</span>
              <input type="text" v-model="money[item.id]" />
              <b @click="goPay(item.payWay, item.id)">下一步</b>
            </div>
          </li>
        </ul>
      </div>
      <div class="btm" :class="{ show: !isBank }">
        <h3>操作步骤：</h3>
        <ul>
          <li>
            ※1.支付宝/云闪付 支付（扫一扫直接到账）方便快捷，支付完成立即到账
          </li>
          <li>※2.24小时存款不限次数，免除所有手续费，3分钟火速到账</li>
          <li>※3.为了加快审核速度，请不要支付整数，如100.1</li>
          <li>※4.公司收款二维码试试更新，请不要保存二维码</li>
          <li>※5.存款遇到问题？立即联络在线客服为你服务</li>
        </ul>
      </div>
      <div class="btm" :class="{ show: isBank }">
        <h3>温馨提示：</h3>
        <ul>
          <li>推荐使用银行卡入款： 更快捷/3分钟到账 更大额度</li>
          <li>*接下来您可以通过以下方式完成转帐:</li>
          <li>※1.网银转帐:登录您的网上银行完成转帐。</li>
          <li>※2.ATM转帐:到您最近的ATM将款项转到左侧收款账号。</li>
          <li>※3.ATM现存:到银行ATM以现金存入到左侧收款账号。</li>
          <li>※4.银行柜台:到您最近的银行将款项转到左侧收款账号。</li>
          <li>※5.手机转帐:通过您的手机验证将款项转到左侧收款账号。</li>
        </ul>
        <h3>*请您注意:</h3>
        <ul>
          <li>※1.完成转帐后请联系在线客服提供用户名帮你确认是否到账。</li>
          <li>※2.请如实填写大概存入时间。</li>
          <li>※3.请勿存入整数金额，以免延误财务查收。</li>
          <li>※4.转帐完成后请保留单据作为核对证明。</li>
        </ul>
      </div>
    </div>
    <div class="popup" v-show="isSubmit">
      <div class="popContent">
        <h3>通知</h3>
        <div class="popMiddle">
          <el-steps direction="vertical" finish-status="success" :active="1">
            <el-step title="充值完成，你的充值申请已经提交成功"></el-step>
            <el-step
              title="充值到账"
              description="充值成功后，你的余额将在1分钟内更新，请稍后查看，若届时仍未更新，请联系在线客服。"
            ></el-step>
          </el-steps>
        </div>
        <div class="btn-sure" @click="goAccount">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import { rechargeBefore, rechargeApply, rechargeSubmit } from "@/api";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "Recharge",
  data() {
    return {
      isSubmit: false,
      rechargeList: [],
      type: 40,
      payWay: "",
      money: {},
      isPayFlag: false,
      options: [
        {
          label: "网银转账"
        },
        {
          label: "ATM自动柜员机"
        },
        {
          label: "ATM现金入款"
        },
        {
          label: "银行柜台转账"
        },
        {
          label: "手机银行转账"
        },
        {
          label: "其他"
        }
      ],
      payAccountName: "",
      amount: "",
      rechargeId: "",
      methodId: "",
      date: "",
      payAccountNameFull: "",
      bankPos: "网银转账"
    };
  },
  created() {
    this.$store.commit("CHANGE_LOADING", 1);
    this.rechargeBefores();
  },
  computed: {
    ...mapGetters(["loading", "order"]),
    isBank() {
      return this.type === 40;
    },
    payWays() {
      return this.payWay == 3;
    },
    TabList() {
      for (let i = 0; i < this.rechargeList.length; i++) {
        let payListOne = this.rechargeList[i];
        if (payListOne.type === this.type) {
          console.log(payListOne.data, "1212");
          return payListOne.data;
        }
      }
    }
  },
  methods: {
    ...mapActions(["rechargeApplys"]),
    ...mapMutations(["CHANGE_LOADING"]),
    onCopy: function() {
      this.$message.success("复制成功，可直接Ctrl+V进行粘贴");
    },
    onError: function() {
      this.$message.error("复制失败，可直接Ctrl+V进行粘贴");
    },
    rechargeBefores() {
      rechargeBefore().then(res => {
        console.log(res);
        this.rechargeList = res.data;
        this.$store.commit("CHANGE_LOADING", 0);
      });
    },
    changeTab(type) {
      this.type = type;
      this.isPayFlag = false;
      this.payAccountName = "";
      this.money = {};
    },
    goPay(payWay, id) {
      this.payWay = payWay;
      this.methodId = id;
      if (!this.money[id] || this.money[id] <= 0) {
        return this.$message.error("请输入充值金额");
      }
      if (payWay == 1) {
        console.log(this.money[id]);
        this.reCharge(
          "/api/pay/create/methodId/" + id + "/money/" + this.money[id]
        );
      } else {
        this.$store.commit("CHANGE_LOADING", 1);
        this.amount = this.money[id];
        rechargeApply({ methodId: id }).then(res => {
          if (res.status) {
            this.$store.commit("CHANGE_LOADING", 0);
            this.$store.commit("ORDERS", res.data);
            this.isPayFlag = true;
          }
        });
      }
    },
    prev() {
      this.isPayFlag = false;
      this.payAccountName = "";
      this.money = {};
    },
    submit() {
      if (!this.payAccountName) {
        return this.$message.error("请输入存款人姓名");
      }
      if (!this.amount) {
        return this.$message.error("请输入存入金额");
      }
      this.rechargeId = this.order.recharge.rechargeId;
      this.date = this.timestampToString(this.order.recharge.actionTime);
      this.payAccountNameFull =
        this.order.rechargeMethod.orderdesc + this.payAccountName;
      if (parseFloat(this.order.rechargeMethod.rechargeMin) > 0) {
        if (this.amount < parseFloat(this.order.rechargeMethod.rechargeMin)) {
          return this.$message.error(
            "充值金额不能低于" + this.order.rechargeMethod.rechargeMin + "元"
          );
        }
      }
      if (parseFloat(this.order.rechargeMethod.rechargeMax) > 0) {
        if (this.amount > parseFloat(this.order.rechargeMethod.rechargeMax)) {
          return this.$message.error(
            "充值金额不能高于" + this.order.rechargeMethod.rechargeMax + "元"
          );
        }
      }
      let parameter;
      if (this.payWays) {
        parameter = {
          rechargeId: this.rechargeId,
          methodId: this.methodId,
          amount: this.amount,
          date: this.date,
          payAccountNameFull: this.payAccountNameFull,
          bankPos: this.bankPos
        };
      } else {
        parameter = {
          rechargeId: this.rechargeId,
          amount: this.amount,
          date: this.date,
          payAccountNameFull: this.payAccountNameFull,
          bankPos: this.bankPos
        };
      }
      console.log(parameter, "充值提交数据------------------");
      this.$store.commit("CHANGE_LOADING", 1);
      rechargeSubmit(parameter).then(res => {
        this.$store.commit("CHANGE_LOADING", 0);
        this.$message.info(res.msg);
        if (res.status) {
          console.log(res, "=============================");
          this.isSubmit = true;
        }
      });
    },
    goAccount() {
      this.isSubmit = false;
    }
  }
};
</script>
<style scoped lang="scss">
.Recharge {
  min-height: 720px;
  .content {
    .top {
      margin-top: 6px;
      margin-bottom: 17px;
      overflow: hidden;
      ul {
        overflow: hidden;
        li {
          cursor: pointer;
          width: 96px;
          height: 37px;
          text-align: center;
          line-height: 37px;
          font-size: 13px;
          float: left;
          margin-left: 10px;
          background-color: #f0f0f0;
          &:first-child {
            margin-left: 31px;
          }
          &:hover {
            background-color: #c7bc8c;
          }
        }
        .on {
          background-color: #c7bc8c;
        }
      }
    }
    .pay {
      overflow: hidden;
      .left {
        float: left;
        width: 400px;
        margin-left: 30px;
        dl {
          min-height: 400px;
          border: 1px solid #dfdfdf;
          border-radius: 10px;
          dt {
            text-align: center;
            font-size: 20px;
            border-bottom: 1px solid #dfdfdf;
            line-height: 50px;
          }
          dd {
            line-height: 50px;
            font-size: 17px;
            color: #a1a1a1;
            span {
              &:first-child {
                padding-left: 15px;
                display: inline-block;
                width: 100px;
              }
              &:nth-child(2) {
                display: inline-block;
                min-width: 250px;
              }
              &:nth-child(3) {
                color: #2d8cf0;
                cursor: pointer;
              }
            }
          }
        }
        div {
          min-height: 400px;
          border: 1px solid #dfdfdf;
          text-align: center;
          border-radius: 10px;

          h3 {
            text-align: center;
            font-size: 20px;
            border-bottom: 1px solid #dfdfdf;
            line-height: 50px;
          }
          img {
            width: 280px;
            height: 300px;
            display: inline-block;
            vertical-align: middle;
            margin-top: 50px;
          }
        }
      }
      .right {
        float: left;
        width: 450px;
        margin-left: 20px;

        .bank,
        > div {
          min-height: 400px;
          border: 1px solid #dfdfdf;
          border-radius: 10px;
          dt,
          h3 {
            text-align: center;
            font-size: 20px;
            border-bottom: 1px solid #dfdfdf;
            line-height: 50px;
          }
          dd,
          li {
            line-height: 50px;
            font-size: 17px;
            color: #a1a1a1;
            span {
              display: inline-block;
              width: 150px;
              &:nth-child(1) {
                padding-left: 15px;
              }
            }
            input {
              height: 40px;
              border: 1px solid #dfdfdf;
              padding-left: 15px;
            }
            &:last-child {
              span {
                padding-left: 0;
                display: inline-block;
                width: 164px;
                height: 44px;
                line-height: 44px;
                text-align: center;
                background: linear-gradient(#fdc937, #f37334);
                font-size: 16px;
                color: white;
                border-radius: 5px;
                cursor: pointer;
                margin-left: 15px;
                margin-top: 20px;
              }
            }
          }
        }
      }
    }
    .middle {
      min-height: 300px;
      margin: 0 31px;
      ul {
        li {
          font-size: 15px;
          background-color: #f0f0f0;
          padding-left: 18px;
          padding-top: 7px;
          color: #9e9e9e;
          h3 {
            line-height: 23px;
            color: #333333;
            font-weight: bold;
          }
          > span {
            line-height: 22px;
          }
          > div {
            margin-top: 4px;
            padding-bottom: 12px;
            input {
              width: 144px;
              height: 32px;
              border: 1px solid #bfbfbf;
              background-color: #f0f0f0;
              padding-left: 20px;
            }
          }
          b {
            display: inline-block;
            height: 34px;
            width: 80px;
            background: linear-gradient(#fdc937, #f37334);
            text-align: center;
            color: white;
            line-height: 34px;
            border-radius: 5px;
            margin-left: 12px;
            cursor: pointer;
          }
        }
      }
    }
    .btm {
      display: none;
      padding-left: 30px;
      font-size: 13px;
      color: #666666;
      margin-top: 38px;
      padding-bottom: 32px;
      h3 {
        line-height: 21px;
      }
      ul {
        li {
          line-height: 27px;
        }
      }
    }
  }
  .popup {
    position: fixed;
    z-index: 5000;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    .popContent {
      background-color: #fff;
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      bottom: 0;
      margin: auto;
      width: 480px;
      transform: translateY(-100%);
      height: 300px;
      h3 {
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        color: #262626;
        border: 1px solid #c8c8c8;
        height: 42px;
        line-height: 42px;
        background-color: rgb(224, 224, 224);
      }
      .popMiddle {
        height: 200px;
        padding: 20px 50px 20px;
      }
      .btn-sure {
        background: linear-gradient(#fdc937, #f37334);
        width: 120px;
        height: 36px;
        margin: auto;
        text-align: center;
        line-height: 36px;
        font-size: 20px;
        cursor: pointer;
        border-radius: 5px;
        color: white;
      }
    }
  }
}
</style>
