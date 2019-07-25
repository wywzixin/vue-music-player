<template>
  <div id="app">
    <Header></Header>
    <Nav></Nav>
    <transition name="fade1">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import Header from "components/header/header";
import Nav from 'components/nav/nav';
export default {
  name: 'App',
  components: {
    Header,
    Nav
  },
}
</script>

<style>
 @import "assets/css/reset.css"; 
 @import "assets/css/mixin.scss";
  #app {
    min-width: 100vw;
    min-height: 100vh;
    background: rgb(34, 34, 34);
  }
  html {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgb(34, 34, 34);
  }
  /* 子路由进去动画 */
  .fade1-enter-active{
    transition: all 0.2s;
  }

  .fade1-enter{
    opacity: 0;
    transform: translate3d(20%, 0, 0);
  }
  .fade1-enter{
    opacity: 0.9;
  }

</style>
