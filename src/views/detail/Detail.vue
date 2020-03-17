<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <Detail-coment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!-- <Toast :message="message" :show="show"/> -->
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailComentInfo from './childComps/DetailComentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
// import Toast from 'components/common/toast/Toast'
import GoodsList from 'components/content/goods/GoodsList'

import {getDetail, getRecommend, Goods, Shop, GoodsParam, } from 'network/detail'
import {itemListenerMixin, backTopMixin} from 'common/mixin'
import {debounce} from 'common/utils'

import {mapActions} from 'vuex' // 把vuex里面的方法映射到当前组件

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailComentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    // Toast
  },
  // 混入
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      // 混入
      itemImgListener: null,
      themTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      // message: '',
      // show: false
    }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // 1.获取数据
      const data = res.result

      // 2.获取顶部的图片的轮播数据
      this.topImages = data.itemInfo.topImages

      // 3.获取商品信息/拿到整合的数据对象，让组件面向这一个对象
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // 4.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)

      // 5.保存商品的详情数据
      this.detailInfo = data.detailInfo

      // 6.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      // 7.取出评论信息
      if(data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

      // 等组件里面的DOM渲染完成后进行回调
      // this.$nextTick(() => {
        
      // })
    })

    // 3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })

    // 4.给getThemeTopY赋值(对给this.themTopYs赋值的操作进行防抖)
    this.getThemeTopY = debounce(() => {
      this.themTopYs = []
      this.themTopYs.push(0)
      this.themTopYs.push(this.$refs.params.$el.offsetTop)
      this.themTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themTopYs.push(this.$refs.recommend.$el.offsetTop)
    }, 50)
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themTopYs[index], 200)
    },
    contentScroll(position) {
      // console.log(position)
      const positionY = -position.y
      let length = this.themTopYs.length
      for(let i = 0; i < length; i++) {
        // 防止赋值的过程过于频繁
        if(this.currentIndex !== i 
        // 判断区间：在0和某个数字之间(i < length - 1)
        && (i < length - 1 && positionY >= this.themTopYs[i] && positionY < this.themTopYs[i+1]) 
        // 判断大于等于：i === length - 1
        || i === length - 1 && positionY >= this.themTopYs[i]) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      this.listShowBackTop(position)
    },
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      // 将商品添加到购物车里方法一(将数据传到Vuex里面进行一系列操作)
      // 2.将商品添加到购物车里(1.Promise 2.mapActions)
      this.addCart(product).then(res => { // 接收promise返回的数据
        // 显示加入购物车或者商品+1(方法一)
        // this.show = true
        // this.message = res

        // setTimeout(() => {
        //   this.show = false
        //   this.message = ''
        // }, 1500)
        // 方法二 使用封装的插件弹出提示消息
        this.$toast.show(res, 2000)
      })
      // 将商品添加到购物车里方法二
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res)
      // })
    }
  },
  mounted() {
    // 拿到防抖函数
    // 混入到mounted
    // const refresh = debounce(this.$refs.scroll.refresh, 50)

    // this.itemImgListener = () => {
    //   refresh()
    // }
    // this.$bus.$on('itemImageLoad', this.itemImgListener)
  },
  destroyed() {
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 58px);
  position: relative;
}
</style>