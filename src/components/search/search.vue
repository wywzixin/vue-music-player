<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll :refreshDelay="refreshDelay" ref="shortcut" class="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey" :key="item.id">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span @click="showConfirm" class="clear">
                <i class="iconfont icon-shanchu2"></i>
              </span>
            </h1>
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest @listScroll="blurInput" @select="saveSearch" ref="suggest" :query="query"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import Suggest from 'components/suggest/suggest'
  import {getHotKey} from 'api/search'
  import { searchMixin} from 'assets/js/mixin'
  import {ERR_OK} from 'api/config'
  import {mapActions} from 'vuex'

  export default {
    mixins: [searchMixin],
    data() {
      return {
        hotKey: []
      }
    },
    computed: {
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    created() {
      this._getHotKey()
    },
    methods: {
      showConfirm() {
        this.$refs.confirm.show()
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    components: {
      SearchBox,
      SearchList,
      Scroll,
      Confirm,
      Suggest
    }
  }
</script>

<style lang="scss" scoped>
 @import "assets/css/mixin.scss";
.search .search-box-wrapper {
  margin: 20px;
}
.search .shortcut-wrapper {
  position: fixed;
  top: 178px;
  bottom: 0;
  width: 100%;
}
.search .shortcut-wrapper .shortcut {
  height: 100%;
  overflow: hidden;
}
.search .shortcut-wrapper .shortcut .hot-key {
  margin: 0 20px 20px 20px;
}
.search .shortcut-wrapper .shortcut .hot-key .title {
  margin-bottom: 20px;
  font-size: 14px;
  color: rgba(255,255,255,0.5);
}
.search .shortcut-wrapper .shortcut .hot-key .item {
  display: inline-block;
  padding: 5px 10px;
  margin: 0 20px 10px 0;
  border-radius: 6px;
  background: #333;
  font-size: 14px;
  color: rgba(255,255,255,0.3);
}
.search .shortcut-wrapper .shortcut .search-history {
  position: relative;
  margin: 0 20px;
}
.search .shortcut-wrapper .shortcut .search-history .title {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  height: 40px;
  font-size: 14px;
  color: rgba(255,255,255,0.5);
}
.search .shortcut-wrapper .shortcut .search-history .title .text {
  -webkit-box-flex: 1;
      -ms-flex: 1;
          flex: 1;
}
.search .shortcut-wrapper .shortcut .search-history .title .clear {
  position: relative;
}
.search .shortcut-wrapper .shortcut .search-history .title .clear:before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
}
.search .shortcut-wrapper .shortcut .search-history .title .clear .icon-shanchu2 {
  font-size: 16px;
  color: rgba(255,255,255,0.3);
}
.search .search-result {
  position: fixed;
  width: 100%;
  top: 178px;
  bottom: 0;
}
</style>