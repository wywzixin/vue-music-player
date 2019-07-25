<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { getSongList } from "api/recommend.js";
import { mapGetters } from "vuex";
import { recomSongList,createSong } from "assets/js/song";
import { ERR_OK } from "api/config";
import musicList from "base/music-list/music-list";
export default {
  name: "recomDetial",
  data() {
    return {
      songs: []
    };
  },
  computed: {
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
    ...mapGetters(["disc"])
  },
  created() {
    this._getSongList();
  },
  methods: {
    _getSongList() {
      getSongList(this.disc.dissid).then(res => {
        let ret = recomSongList(res)
        if (ret.code === ERR_OK) {
          this.songs = this._normalizeSongs(ret.cdlist[0].songlist);
        }
      });
    },
    _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
  },
  components: {
    musicList 
  }
};
</script>

<style lang="scss" scoped>
  .slide-enter-active, .slide-leave-active{
     transition: all 0.3s
  }
  
  .slide-enter, .slide-leave-to {
     transform: translate3d(100%, 0, 0)
  }
</style>