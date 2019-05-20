<template>
  <div class="title">
    <span>{{ firstName }}</span>
    <span v-show="lastName"> > </span>
    <span>{{ lastName }}</span>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
export default {
  name: "userTitle",
  data() {
    return {
      firstName: Base64.decode(this.$route.query.firstName),
      lastName: Base64.decode(this.$route.query.lastName)
    };
  }
};
</script>

<style scoped lang="scss">
.title {
  line-height: 60px;
  height: 60px;
  box-sizing: border-box;
  border-bottom: 1px solid #e3ebf6;
  background-color: #f9fbfd;
  span {
    font-size: 19px;
    &:first-child {
      padding-left: 30px;
    }
    &:nth-child(2) {
      padding: 0 8px;
      font-size: 20px;
    }
  }
}
@media screen and (max-width: 1400px) {
  .title {
    span {
      font-size: 15px;
    }
  }
}
</style>
