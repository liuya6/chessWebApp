<template>
  <div id="app" v-title="'彩票'">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"> </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"> </router-view>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "app",
  data() {
    return {
      timer: null
    };
  },
  created() {
    // console.log("APP.VUE----------------------------");
    this.checkLogins();
    if (this.userInfo) {
      this.timer = setInterval(() => {
        // console.log("持续请求用户信息");
        this.userDetails();
      }, 10000);
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  watch: {
    userInfo(newVal) {
      // console.log(newVal, this.timer, "APP==========");
      if (newVal) {
        if (!this.timer) {
          this.timer = setInterval(() => {
            // console.log("持续请求用户信息", "watch");
            this.userDetails();
          }, 10000);
        }
      } else {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    ...mapActions(["userDetails", "checkLogins"])
  }
};
</script>
