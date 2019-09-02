<template>
   <div class="music-list">
    <div class="back" @click="back">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div> -->
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" @scroll="scroll"
            :listen-scroll="listenScroll" :probe-type="probeType" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectItem"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
 import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import SongList from 'base/song-list/song-list'
  import {prefixStyle} from 'assets/js/dom' 
  import {playlistMixin} from 'assets/js/mixin'
  import {mapActions} from 'vuex'

  const RESERVED_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')
  
export default {
  mixins: [playlistMixin],
  data() {
    return {
        scrollY: 0
    };
  },
  computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
  },
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array
      // default: ""
    },
    title: {
      type: String,
      default: ""
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    methods: {
       handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.go(-1)
      },
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
       ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      scrollY(newVal) {
        let translateY = Math.max(this.minTransalteY, newVal)
        let scale = 1
        let zIndex = 0
        let blur = 0
        const percent = Math.abs(newVal / this.imageHeight)
        if (newVal > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20, percent * 20)
        }

        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        if (newVal < this.minTransalteY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
         // this.$refs.playBtn.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
         // this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex
      }
    },
  components: {
    SongList,
    Scroll,
    Loading
  }
};
</script>

<style lang="scss" scoped>
@import "assets/css/mixin.scss";
.music-list{
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #222;
}
  .back {
  position: absolute;
  top: 0;
  left: 6px;
  z-index: 50;
}
.back .icon-fanhui {
  display: block;
  padding: rem(10);
  font-size: 22px;
  color: #ffcd32;
}
.title {
  position: absolute;
  top: 0;
  left: 10%;
  z-index: 40;
  width: 80%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  line-height: rem(40);
  font-size: 18px;
  color: #fff;
}
.bg-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 70%;
  -webkit-transform-origin: top;
          transform-origin: top;
  background-size: cover;
}
.bg-image .play-wrapper {
  position: absolute;
  bottom: rem(20);
  z-index: 50;
  width: 100%;
}
.bg-image .play-wrapper .play {
  box-sizing: border-box;
  width: rem(135);
  padding: rem(7) 0;
  margin: 0 auto;
  text-align: center;
  border: 1px solid #ffcd32;
  color: #ffcd32;
  border-radius: rem(100);
  font-size: 0;
}
.bg-image .play-wrapper .play .icon-play{
  display: inline-block;
  vertical-align: middle;
  margin-right:rem(6);
  font-size: 16px;
}
.bg-image .play-wrapper .play .text {
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
}
 .bg-image .filter{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(7,17,27,0.4);
}
.bg-layer {
  position: relative;
  height: 100%;
  background: #222;
}
.list {
  position: absolute;
  top: rem(263);
  bottom: 0;
  width: 100%;
  background: #222;
}
.list .song-list-wrapper {
  padding:rem(20) rem(30);
}
  </style>