<template>
  <div class="song-list" ref="songList">
    <ul>
      <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs" :key="index">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
    <div class="loading" v-show="songs.length === 0?1:0">
      <loading></loading>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import loading from "base/loading/loading";
export default {
  components: {
    loading
  },
  props: {
    songs: {
      type: Array
      // default: [1]
    },
    rank: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit("select", item, index);
    },
    getDesc(song) {
      return `${song.singer}·${song.album}`;
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return "text";
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "assets/css/mixin.scss";
.rank {
  float: left;
  margin-top: rem(20);
}
.item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: rem(64);
    font-size: 14px;
}
.text {
  display: inline-block;
  width: rem(25);
  height: rem(24);
  margin-right: rem(30);
  color: #ffcd32;
  font-size: rem(18);
  text-align: center;
}
.icon {
  display: inline-block;
  width: rem(25);
  height: rem(24);
  background-size: rem(25) rem(24);
  margin-right: rem(30);
}
.icon0 {
  background-image: url("./first@3x.png");
}
.icon1 {
  background-image: url("./second@3x.png");
}
.icon2 {
  background-image: url("./third@3x.png");
}
.content {
   flex: 1;
   line-height: 20px;
   overflow: hidden;
}
.name {
  max-width: rem(250);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: rem(15);
  color:#ffffff;
}
.desc {
  max-width: rem(250);
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: rem(10);
  color: rgba(255, 255, 255, 0.3);
}
</style>
