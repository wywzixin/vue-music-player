<template>
    <div class="tab">
        <router-link  to="recommend" class="nav">
             <span>推荐</span>
        </router-link>
          <router-link  to="singer" class="nav">
             <span>歌手</span>
        </router-link>
          <router-link  to="rank" class="nav">
             <span>排行</span>
        </router-link>
          <router-link  to="search" class="nav">
             <span>搜索</span>
        </router-link>
    </div>
</template>

<script>
    export default {
        name:'Nav',
        data() {
            return {
                
            }
        },
    }
</script>

<style lang="scss" scoped>
@import "assets/css/mixin.scss";
.tab {
    display: flex;
    width:100%;
    height: rem(44);
    justify-content:space-between;
    position: relative;
}
.nav {
    display:inline-block;
    flex:1;
    height: 100%;
    background:rgb(34,34,34);
    line-height: rem(40);
    text-align:center;
    color: rgba(255,255,255,0.5);
    font-size:rem(15);
}
.router-link-active {
    span {
        color:#ffcd32;
        border-bottom: 2px solid #ffcd32;
        padding-bottom: rem(5);
    }
}
</style>