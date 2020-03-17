<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行', '新款', '精选']" 
                  @tabClick="tabClick" 
                  ref="tabControl1" 
                  class="tab-control" v-show="isTabFixed"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll" 
            :pull-up-load="true" 
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control :titles="['流行', '新款', '精选']" 
                    @tabClick="tabClick" 
                    ref="tabControl2" />
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper"
import RecommendView from "./childComps/RecommendView"
import FeatureView from "./childComps/FeatureView"

import NavBar from "components/common/navbar/NavBar"
import TabControl from "components/content/tabControl/TabControl"
import GoodsList from "components/content/goods/GoodsList"
import Scroll from "components/common/scroll/Scroll"

import { getHomeMultidata, getHomeGoods } from "network/home"
import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin'


export default {
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll
  },
  // 混入
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      // 函数调用 -> 压入函数栈(保存函数调用过程中所有变量)
      // 函数调用结束 -> 弹出函数栈(释放函数所有的变量)
      // 把请求到的数据保存到data里面，防止内存回收
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: 'pop',
      // isShowBackTop: false, 混入
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
      // 混入
      itemImgListener: null
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  // 销毁首页/自动创建首页
  // destroyed() {
  //   console.log('home destroyed')
  // },
  activated() {
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
  },
  deactivated() {
    // 1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY()

    // 2.取消事件总线的全局事件监听
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata()

    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted() {
    // 1.监听item图片加载完成,使用防抖函数对高度进行刷新
    // 混入
    // const refresh = debounce(this.$refs.scroll.refresh, 50)
    // this.itemImgListener = () => {
    //   refresh()
    // }
    // this.$bus.$on('itemImageLoad', this.itemImgListener)
  },
  methods: {
    /**
     * 事件监听相关的方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    // backClick() {
      // this.$refs.scroll.scrollTo(0, 0) // 混入
    // },
    contentScroll(position) {
      // 1.监听首页滚动，判断BackTop是否显示或者隐藏
      // this.isShowBackTop = -position.y > 1000 混入
      this.listShowBackTop(position)

      // 2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = -position.y > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)

      // this.$refs.scroll.scroll.refresh()
    },
    // 2.获取tabControl的offsetTop
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // this.result = res
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  box-shadow: 0 1px 1px rgba(100, 100, 100, .1)

  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

/* .content {
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;
} */

.tab-control {
  position: relative;
  z-index: 9;
}
</style>