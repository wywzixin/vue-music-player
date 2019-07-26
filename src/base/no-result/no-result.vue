<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "assets/css/mixin.scss";
  .no-result {
    text-align: center;
    .no-result-icon {
      width: rem(86);
      height: rem(90);
      margin: 0 auto;
      background-size: rem(86) rem(90);
    }
    .no-result-text {
      margin-top: rem(30);
      font-size: 14px;
      color: $color-text-d;
    }
  }
</style>