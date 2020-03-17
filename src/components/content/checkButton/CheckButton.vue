<template>
  <div class="check-button" :class="{check: isChecked}">
    <img src="~assets/img/cart/tick.svg" alt="">
  </div>
</template>

<script>
export default {
  props: {
    isChecked: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.check-button {
  border-radius: 50%;
  border: 2px solid #aaa;
  padding-right: 1px;
}

.check-button > img {
  width: 15px;
  height: 15px;
}

.check {
  background-color: var(--color-high-text);
  border-color: var(--color-high-text);
}
</style>