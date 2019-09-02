<template>
 <scroll 
 ref="suggest" 
 class="suggest" 
 :data="result" 
 :pullp="pullup"
 :beforeScroll="beforeScroll"
 @scrollToEnd="searchMore"
 @beforeScroll="listScroll"
 >
  <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result" :key="item">
        <div class="icon">
          <i class="iconfont icon-yinle"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
 </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import NoResult from "base/no-result/no-result";
import { search } from "api/search";
import { ERR_OK } from "api/config";
import { createSong, isValidMusic, processSongsUrl} from "assets/js/song";
import { mapMutations, mapActions } from "vuex";
import Singer from "assets/js/singer";

const TYPE_SINGER = "singer";
const perpage = 20;
   export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 1,
        pullup: true,
        beforeScroll: true,
        hasMore: true,
        result: []
      }
    },
    methods: {
      refresh() {
        this.$refs.suggest.refresh()
      },
      search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this._genResult(res.data).then((result) => {
              this.result = result
            })
            this._checkMore(res.data)
          }
        })
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this._genResult(res.data).then((result) => {
              this.result = this.result.concat(result)
            })
            this._checkMore(res.data)
          }
        })
      },
      listScroll() {
        this.$emit('listScroll')
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          //this.setSinger(singer)
        } else {
          //this.insertSong(item)
        }
        this.$emit('select', item)
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      // getIconCls(item) {
      //   if (item.type === TYPE_SINGER) {
      //     return 'icon-mine'
      //   } else {
      //     return 'icon-music'
      //   }
      // },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid && this.page === 1) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          ret = ret.concat(songs)
          return ret
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      // ...mapMutations({
      //   setSinger: 'SET_SINGER'
      // }),
      // ...mapActions([
      //   'insertSong'
      // ])
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          return
        }
        this.search(newQuery)
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style lang="scss" scoped>
@import "assets/css/mixin.scss";
.suggest  {
  height: 100%;
  overflow: hidden;
}
.suggest .suggest-list  {
  padding: 0 rem(30);
}
.suggest .suggest-list .suggest-item  {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  padding-bottom: rem(20);
  cursor: pointer;
}
.suggest .suggest-list .icon  {
     flex: 0 0 30px;
    width: 30px;
}
.icon-yinle {
  font-size: 14px;
  color: rgba(255,255,255,0.3);
}
.suggest .suggest-list .name  {
  -webkit-box-flex: 1;
      -ms-flex: 1;
          flex: 1;
  font-size: 14px;
  color: rgba(255,255,255,0.3);
  overflow: hidden;
}
.suggest .suggest-list .name .text  {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.suggest .no-result-wrapper  {
  position: absolute;
  width: 100%;
  top: 50%;
  -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
}
</style>