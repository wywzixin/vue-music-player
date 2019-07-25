<template>
 <div class="recommend">
  <Scroll  v-if="banner.length" :data="discList" class="recommend-content" ref="scroll">
    <div>
      <div class="swiper-container">
        <swiper   v-if="banner.length" class="swiper-wrapper" :options="swiperOption" ref="mySwiper">
          <swiperSlide class="swiper-slide" v-for="(item,index) in banner" :key="index">
            <a :href="item.linkUrl">
              <img @load="imgOnload" :src="item.picUrl" alt />
            </a>
          </swiperSlide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div class="gedanTitle" v-show="discList">热门歌单推荐</div>
      <ul v-if="discList.length"  class="discList-ul" ref="discListUl">
          <li @click="selectItem(item)" class="discList-li" v-for="(item,index) in discList" :key="index">
             <img v-lazy="item.imgurl" alt="歌单" :title="item.creator.name">
             <div class="discList-con">
                <h2>{{item.creator.name}}</h2>
                <p>{{item.dissname}}</p>
             </div>
          </li>
      </ul>
    </div>
     <div class="loading" v-show="!discList.length">
      <loading></loading>
    </div>
  </Scroll>
  <transition name="fade">
      <router-view></router-view>
    </transition>
 </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import loading from "base/loading/loading";
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { getRecommend, getDiscList } from "api/recommend.js";
import {mapMutations} from 'vuex'
import { ERR_OK } from "api/config"
export default {
  name: "Recommend",
  data() {
    return {
      banner: [],
      discList: [],
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          type: "progressbar"
        },
        autoplay: true
      }
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  computed: {
    swiper() {
      return this.$rerfs.mySwiper.swiper;
    }
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.banner = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
   imgOnload() {
      if (!this.checkloaded) {
        this.checkloaded = true;
        this.$refs.scroll.refresh();
      }
    },
    selectItem(item) {
      this.$router.push({
        path:`/recommend/${item.dissid}`
      })
      this.setDisc(item)
     // this.$store.commit("SET_DISC",item)
    },
    ...mapMutations ({
       setDisc:"SET_DISC"
    })
  },
  components: {
    swiper,
    loading,
    swiperSlide,
    Scroll
  }
};
</script>

<style lang="scss" scoped>
@import "assets/css/mixin.scss";
.recommend {
    position: fixed;
    width: 100%;
    top: rem(88);
    bottom: 0;
}
.recommend-content {
    height: 100%;
    overflow: hidden;
}
// .app {
//   width: 100vw;
//   height: 86vh;
//   overflow: hidden;
// }
.swiper-container {
  width: 100%;
  height: rem(150);
  background: #fff;
}
.swiper-container img {
  width: 100%;
  height: rem(150);
}
.gedanTitle {
  width:100%;
  height: rem(65);
  line-height: rem(65);
  text-align: center;
  letter-spacing: rem(2);
  font-size: 14px;  //字体需要加在rem上吗
  color: #ffcd32;
}
.discList-ul {
  width:100%;
}
.discList-li {
  width:100%;
  min-height: rem(80);
  box-sizing: border-box;
  padding: 0 rem(20) rem(20) rem(20);
  position: relative;
}
.discList-li img {
  width:rem(60);
  height: rem(60);
  position: absolute;
}
.discList-con {
  padding-left:rem(80);
}
.discList-con h2 {
   margin-bottom: rem(10);
  color: #fff;
  font-size: rem(15);
  padding-top: rem(6);
}

.discList-con p {
  color: hsla(0, 0%, 100%, 0.3); //色调，饱和度，亮度，透明度
  font-size: rem(14);
}
.loading {
  position: fixed;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
/* 子路由进去动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>