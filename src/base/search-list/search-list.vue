<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li :key="item" class="search-item" @click="selectItem(item)" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="iconfont icon-shanchu1"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: []
    }
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
    },
    deleteOne(item) {
      this.$emit("delete", item);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "assets/css/mixin.scss";
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: rem(40);
    overflow: hidden;
    font-size: 16px;
    &.list-enter-active,
    &.list-leave-active {
      transition: all 0.1s;
    }
    &.list-enter,
    &.list-leave-to {
      height: 0;
    }
    .text {
      flex: 1;
      color: hsla(0,0%,100%,.5);
    }
    .icon {
        position: relative;
    }
  }
}
.icon-shanchu1{
    font-size: 12px;
    color: hsla(0, 0%, 100%, 0.3);
 }
</style>