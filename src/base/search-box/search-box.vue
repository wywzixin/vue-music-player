<template>
  <div class="search-box">
    <i class="iconfont icon-sousuo"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder" />
    <i @click="clear" v-show="query" class="iconfont icon-shanchu"></i>
  </div>
</template>

<script>
import { debounce } from "assets/js/util";
export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  created() {
    this.$watch(
      "query",
      debounce(newQuery => {
        this.$emit("query", newQuery);
      }, 200)
    );
  },
  methods: {
    clear() {
      this.query = "";
    },
    setQuery(query) {
      this.query = query;
    },
    blur() {
      this.$refs.query.blur();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "assets/css/mixin.scss";
.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 rem(6);
  height: rem(40);
  background: #333;
  border-radius: rem(6);
  .icon-sousuo {
    font-size: 24px;
    color: #222;
  }
  .icon-shanchu {
    font-size: 16px;
    color: #222;
  }
  .box {
    flex: 1;
    margin: 0 rem(5);
    background: #333;
    line-height: rem(18);
    color: #fff;
    font-size: 14px;
    border:none;
     &::placeholder {
         color:rgba(255, 255, 255, 0.3);
     }
  }
}
</style>