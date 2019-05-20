<template>
  <div
    class="body"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <iframe
      id="iframeBox"
      frameborder="0"
      width="100%"
      height="100%"
      :src="gameUrl"
    ></iframe>
    <div class="GamePopup" v-show="!loading">
      <span>
        <img src="/images/home.png" alt="" draggable="false" />
      </span>
      <span @click="gaBack">
        返回
      </span>
    </div>
    <div class="layer"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "StartHall",
  data() {
    return {
      loading: true
    };
  },
  created() {
    console.log(this.gameUrl);
    this.$nextTick(() => {
      let iframe = document.getElementById("iframeBox");
      let that = this;
      console.log(iframe);
      if (iframe.attachEvent) {
        iframe.attachEvent("onload", function() {
          // IE
          that.loading = false;
        });
      } else {
        iframe.onload = function() {
          // 非IE
          that.loading = false;
        };
      }
    });
  },
  mounted() {
    let Popup = document.getElementsByClassName("GamePopup")[0];
    let Layer = document.getElementsByClassName("layer")[0];
    let WindowWidth = document.body.clientWidth;
    let WindowHeight = document.body.clientHeight;
    let boxWidth = Popup.offsetWidth;
    let boxHeight = Popup.offsetHeight;
    let startX;
    let startY;
    let flag;
    let isClick = true;
    Popup.onmousedown = function(e) {
      Layer.style.display = "block";
      Popup.style.cursor = "move";
      e = window.event || e;
      startX = e.clientX - Popup.offsetLeft;
      startY = e.clientY - Popup.offsetTop;
      flag = true;
    };
    Layer.onmousemove = function(e) {
      e = window.event || e;
      let endX = e.clientX;
      let endY = e.clientY;
      let moveX = endX - startX;
      let moveY = endY - startY;
      if (moveX <= 0) {
        moveX = 0;
      } else if (moveX >= WindowWidth - boxWidth) {
        moveX = WindowWidth - boxWidth;
      }
      if (moveY <= 0) {
        moveY = 0;
      } else if (moveY >= WindowHeight - boxHeight) {
        moveY = WindowHeight - boxHeight;
      }
      if (flag) {
        isClick = false;
        Popup.style.left = moveX + "px";
        Popup.style.top = moveY + "px";
      }
    };
    Popup.onmouseup = function() {
      Popup.style.cursor = "default";
      Layer.style.display = "none";
      flag = false;
      if (isClick) {
        for (let i = 1; i < this.childNodes.length; i++) {
          let item = this.childNodes[i];
          if (item.style.display == "inline-block") {
            item.style.display = "none";
          } else {
            item.style.display = "inline-block";
          }
        }
      } else {
        isClick = true;
      }
    };
  },
  destroyed() {
    this.$store.commit("SET_GAME_URL", "");
  },
  computed: {
    ...mapGetters(["gameUrl"])
  },
  methods: {
    gaBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped lang="scss">
html,
body,
#app,
.body {
  height: 100vh;
}
iframe {
  position: relative;
  z-index: 1;
}
.layer {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: none;
  opacity: 0;
  filter: alpha(opacity=50);
}
.GamePopup {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 60px;
  left: 50px;
  top: 200px;
  color: #fff;
  padding: 10px;
  font-size: 20px;
  cursor: pointer;
  white-space: nowrap;
  z-index: 3;
  span {
    display: inline-block;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    vertical-align: top;
    border-radius: 50%;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      transform: scale(0.8);
    }
    &:nth-child(2) {
      width: 55px;
      height: 55px;
      line-height: 55px;
      background-color: rgba(255, 255, 255, 0.3);
      margin-left: 20px;
      color: #fff;
      display: none;
      font-size: 16px;
    }
  }
}
</style>
