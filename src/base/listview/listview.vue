<template>
    <scroll @scroll="scroll"
           :listen-scroll="listenScroll"
           :probe-type="probeType"
           :data="data"
           class="listview"
           ref="listview">
          <ul>
      <li v-for="group in data" class="list-group" ref="listGroup" :key="group.index">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item" :key="item.index">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"
         @touchend.stop>
      <ul>
        <li v-for="(item, index) in shortcutList" :data-index="index" class="item"
           :key="index" :class="{'current':currentIndex===index}">{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
    </scroll>
</template>

<script>
 import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'assets/js/dom'
    const TITLE_HEIGHT = 30
  const ANCHOR_HEIGHT = 18
  
  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
      this.touch = {}
      this.listHeight = []
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex

        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta

        this._scrollTo(anchorIndex)
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="scss" scoped>
   @import "assets/css/mixin.scss";
.listview  {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #222;
}
.listview .list-group  {
  padding-bottom: rem(30);
}
.listview .list-group .list-group-title  {
  height: rem(30)px;
  line-height: rem(30);
  padding-left: rem(30);
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  background: #333;
}
.listview .list-group .list-group-item  {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  padding: rem(20) 0 0 rem(30);
}
.listview .list-group .list-group-item .avatar  {
  width: rem(50);
  height: rem(50);
  border-radius: 50%;
}
.listview .list-group .list-group-item .name  {
  margin-left: rem(20);
  color: rgba(255,255,255,0.5);
  font-size: 14px;
}
.listview .list-shortcut  {
  position: absolute;
  z-index: 30;
  right: 0;
  top: 50%;
  -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
  width: rem(20);
  padding: rem(20) 0;
  border-radius: rem(10);
  text-align: center;
  background: rgba(0,0,0,0.3);
  font-family: Helvetica;
}
.listview .list-shortcut .item  {
  padding: rem(3);
  line-height: 1;
  color: rgba(255,255,255,0.5);
  font-size: 12px;
}
.listview .list-shortcut .item.current  {
  color: #ffcd32;
}
.listview .list-fixed  {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.listview .list-fixed .fixed-title  {
  height: rem(30);
  line-height: rem(30);
  padding-left: rem(20);
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  background: #333;
}
.listview .loading-container  {
  position: absolute;
  width: 100%;
  top: 50%;
  -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
}
</style>