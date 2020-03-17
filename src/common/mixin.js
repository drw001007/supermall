import {debounce} from './utils'
import BackTop from 'components/content/backTop/BackTop'
import {POP, NEW, SELL} from "./const"

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 50)
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    listShowBackTop(position) {
      this.isShowBackTop = -position.y > 1000
    }
  }
}

export const tabControlMixin = {
  data() {
    return {
      currentType: POP
    }
  },
  methods: {
    itemClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
    }
  }
}