<template>
  <div class="rank" ref="back">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="item in topList" :key="item.id">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList" :key="index">
              <span>{{index+1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
          <div class="loading-container" v-show="!topList.length">
            <loading></loading>
          </div>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getTopList } from "api/rank";
import { ERR_OK } from "api/config";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      topList: []
    };
  },
  components: {
    Scroll,
    Loading
  },
  created() {
    this._getTopList();
  },
  methods: {
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
    },
    selectItem(item) {
       this.$router.push({
         path:`/rank/${item.id}`
       })
       this.setTopList(item)
    },
    ...mapMutations({
       setTopList:'SET_TOP_LIST'
    })
  }
};
</script>

<style lang="scss" scoped>
@import "assets/css/mixin.scss";
.rank {
    position:fixed;
    width:100%;
    top:rem(80);
    bottom:0;
    .toplist {
        height:100%;
        overflow: hidden;
        .item {
            display: flex;
            margin:0 rem(20);
            padding-top: rem(20);
            height: rem(100);
            &:last-child {
                padding-bottom: rem(20);
            }
            .icon {
                flex:0 0 rem(100);
                width: rem(100);
                height: rem(100);
            }
            .songlist {
                flex:1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 rem(20);
                height: rem(100);
                overflow: hidden;
                background: #333;
                color: hsla(0,0%,100%,.3);
                font-size: 14px;
                .song {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    line-height: rem(26);
                }
            }
        }
        .loading-container{
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}
</style>