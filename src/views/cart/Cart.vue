<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <cart-list/>
    <cart-bottom-bar/>
  </div>
</template>

<script>
import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'

import NavBar from 'components/common/navbar/NavBar'

import { mapGetters } from 'vuex'

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // carLength() {
    //   return this.$store.getters.carLength
    // }
    // 两种语法/获取Vuex里面的数据
    ...mapGetters(['cartLength'])
    // ...mapGetters({
    //   length: 'cartLength'
    // })
  }
}
</script>

<style scoped>
.cart {
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 1px 1px rgba(100, 100, 100, .1)
}
</style>