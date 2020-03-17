<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item, index) in cartList" 
                      :key="index" 
                      :item-info="item"/>
    </scroll>
  </div>
</template>

<script>
import CartListItem from './CartListItem'


import Scroll from 'components/common/scroll/Scroll'

import {mapGetters} from 'vuex' // 把vuex里面的计算属性映射到当前组件

export default {
  components: {
    CartListItem,
    Scroll
  },
  computed: {
    ...mapGetters(['cartList']) // 把vuex里面的计算属性映射到当前组件
  },
  activated() {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
.cart-list {
  height: calc(100% - 44px - 49px - 40px);
}

.content {
  height: 100%;
  overflow: hidden;
}
</style>