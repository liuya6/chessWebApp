<template>
  <div class="container">
    <div>
      <my-userTitle></my-userTitle>
    </div>
    <div class="main">
      <ul class="msgList">
        <li class="th">
          <div>选择</div>
          <div>内容</div>
          <div>时间</div>
          <div>发件人</div>
          <div>状态</div>
          <div>操作</div>
        </li>
        <li v-for="(item, i) in msgList" :key="i">
          <div>
            <label for="check"></label>
            <input id="check" type="checkbox" />
          </div>
          <div>
            {{ item.content }}
          </div>
          <div>
            {{ item.date }}
          </div>
          <div>
            {{ item.addresser }}
          </div>
          <div>
            {{ item.status }}
          </div>
          <div>
            删除
          </div>
        </li>
        <li>
          <div>
            <label for="check"></label>
            <input id="check" type="checkbox" />
            <span class="checkall">全选</span>
          </div>
          <span class="del">删除</span>
          <span>标记已读</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const msgList = [
  {
    content: "您的账号成功充值1000000元",
    date: "2019-4-6 18:54:34",
    addresser: "系统消息",
    status: "未查看"
  },
  {
    content: "您的账号成功充值1000000元",
    date: "2019-4-6 18:54:34",
    addresser: "系统消息",
    status: "未查看"
  },
  {
    content: "您的账号成功充值1000000元",
    date: "2019-4-6 18:54:34",
    addresser: "系统消息",
    status: "未查看"
  },
  {
    content: "您的账号成功充值1000000元",
    date: "2019-4-6 18:54:34",
    addresser: "系统消息",
    status: "未查看"
  },
  {
    content: "您的账号成功充值1000000元",
    date: "2019-4-6 18:54:34",
    addresser: "系统消息",
    status: "未查看"
  },
  {
    content: "您的账号成功充值1000000元",
    date: "2019-4-6 18:54:34",
    addresser: "系统消息",
    status: "未查看"
  },
  {
    content: "您的账号成功充值1000000元",
    date: "2019-4-6 18:54:34",
    addresser: "系统消息",
    status: "未查看"
  },
  {
    content: "您的账号成功充值1000000元",
    date: "2019-4-6 18:54:34",
    addresser: "系统消息",
    status: "未查看"
  }
];
export default {
  name: "Message",
  data() {
    return {
      msgList
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 720px;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  background: #f9f7f8;
  div:first-child {
    width: 100%;
    height: 64px;
  }
  .main {
    flex: 1;
    background: #f9f7f8;
    .msgList {
      overflow: hidden;
      li.th {
        height: 60px;
        font-size: 16px;
        line-height: 60px;
        color: #333;
      }
      li {
        height: 48px;
        line-height: 48px;
        color: #000;
        border-bottom: 1px solid #dcdddd;
        font-size: 16px;
        div {
          float: left;
          height: 100%;
          label {
            width: 20px;
            height: 20px;
            background-color: #ffffff;
            text-align: center;
            line-height: 62px;
            border-radius: 8px;
            font-size: 26px;
          }
          input {
            width: 20px;
            height: 20px;
          }
        }
        div:first-child {
          width: 15%;
          text-align: center;
        }
        div:nth-of-type(2) {
          width: 35%;
          text-align: left;
        }
        div:nth-of-type(3) {
          width: 20%;
        }
        div:nth-of-type(4) {
          width: 10%;
        }
        div:nth-of-type(5) {
          width: 10%;
        }
        div:nth-of-type(6) {
          width: 10%;
        }
      }
      li:last-child {
        height: 61px;
        font-size: 14px;
        color: #666;
        background: #f0f0f0;
        line-height: 61px;
        div {
          position: relative;
          span.checkall {
            position: absolute;
            display: block;
            font-size: 14px;
            top: 0px;
            height: 16px;
            right: 30px;
            z-index: 10;
            color: #666;
            background-color: #f0f0f0;
          }
        }
        > span {
          width: 96px;
          text-align: center;
          height: 40px;
          line-height: 40px;
          display: block;
          float: right;
          margin-top: 10px;
          border-radius: 10px;
          border: 1px solid #dcdcdc;
        }
        span.del {
          width: 86px;
          background: #3c475c;
          color: #999;
          margin-right: 40px;
          margin-left: 17px;
        }
        span:last-child {
          background: #fff;
        }
      }
    }
  }
}
</style>
