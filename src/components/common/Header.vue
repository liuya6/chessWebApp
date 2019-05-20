<template>
  <div
    class="header"
    :class="{ 'header-scroll': isScroll }"
    :style="{ backgroundColor: header_black ? '#2f3339' : '' }"
  >
    <div class="nav w1400">
      <div @click="$router.push({ name: 'home' })" style="cursor: pointer">
        <img src="/images/logo.png" alt="" draggable="false" />
      </div>
      <ul>
        <li v-for="(item, i) in NavList" :key="i">
          <span
            @click="
              tab(
                item.enName,
                item.type,
                item.firstName,
                item.lastName,
                item.list
              )
            "
            :class="{ active: routerName == item.enName }"
          >
            {{ item.name }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "my-Head",
  data() {
    return {
      isScroll: false
    };
  },
  props: ["header_black"],
  created() {
    window.addEventListener("scroll", this.handleScroll);
    console.log(this.hallList);
  },
  activated() {
    console.log(this.$router.currentRoute.name, "header---------------------");
  },
  computed: {
    ...mapGetters(["hallList"]),
    NavList() {
      let navList = [{ name: "首页", enName: "home" }];
      let ListLast = [
        { name: "优惠活动", enName: "activitys" },
        {
          name: "个人中心",
          enName: "user",
          type: "Information",
          firstName: "个人信息",
          lastName: "账户信息"
        }
      ];
      navList = navList.concat(this.hallList).concat(ListLast);
      return navList;
    },
    routerName() {
      return this.$router.currentRoute.name;
    }
  },
  methods: {
    ...mapMutations(["SET_GAME_LIST"]),
    handleScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop >= 120) {
        this.isScroll = true;
      } else {
        this.isScroll = false;
      }
    },
    tab(name, type, firstName, lastName, list) {
      console.log(this.$router.currentRoute.name);
      if (type) {
        this.$router.push({
          name: "user",
          query: {
            type: Base64.encode(type),
            firstName: Base64.encode(firstName),
            lastName: lastName !== firstName ? Base64.encode(lastName) : ""
          }
        });
      } else {
        if (list) {
          this.$store.commit("SET_CURRENT_GAME", list);
        }
        this.$router.push({ name: name });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  min-width: 1400px;
  position: fixed;
  left: 0;
  top: 44px;
  right: 0;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0);
  transition: 0.3s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  .nav {
    transition: 0.3s;
    padding: 10px 0;
    div {
      float: left;
      width: 232px;
      margin-top: 10px;
      transition: 0.3s;
      img {
        width: 100%;
        transition: 0.3s;
      }
    }
    ul {
      display: flex;
      justify-content: flex-end;
      overflow: hidden;
      li {
        margin-left: 60px;
        font-size: 20px;
        line-height: 70px;
        display: block;
        span {
          color: white;
          cursor: pointer;
          &:hover {
            color: #eaac02;
          }
        }
        .active {
          color: #eaac02;
        }
        i {
          display: inline-block;
          margin-right: 10px;
          img {
            vertical-align: bottom;
          }
        }
      }
    }
  }
}
.header-scroll {
  background-color: #2f3339;
  .nav {
    padding: 0;
    div {
      img {
        transform: scale(0.8);
      }
    }
  }
}

@media screen and (max-width: 1400px) {
  .header {
    .nav {
      ul {
        li {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
