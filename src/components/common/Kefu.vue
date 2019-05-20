<template>
  <div class="wrapper" style="top:350px">
    <div class="kefu">
      <img src="/images/k2.png" alt="" />
      <a target="_blank" :href="kefuOnline || setting.kefuGG"> </a>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "my-Kefu",
  data() {
    return {};
  },
  props: ["kefuOnline"],
  created() {
    this.$nextTick(() => {
      let wrapper = document.getElementsByClassName("wrapper")[0];
      window.addEventListener("scroll", () => {
        let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
        wrapper.style.top = scrollTop + 350 + "px";
      });
    });
  },
  computed: {
    ...mapGetters(["setting"])
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  width: 76px;
  height: 144px;
  position: absolute;
  right: 0;
  z-index: 7;
  transition: 0.5s;
  background: url("/images/kefu.png") no-repeat;
  -webkit-background-size: 100%;
  background-size: 100%;
  .kefu {
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
    img {
      position: absolute;
      top: -117px;
      right: 5px;
      width: 130px;
      height: 120px;
    }
    a {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
