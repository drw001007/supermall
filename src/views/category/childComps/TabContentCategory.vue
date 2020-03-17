<template>
  <div>
    <grid-view :clos="3" :lineSpace="15" v-if="subcategories.list">
      <div class="item" v-for="(item, index) in subcategories.list" :key="index">
        <a>
          <img class="item-img" href="item.link" :src="item.image">
          <div class="item-text">{{item.title}}</div>
        </a>
      </div>
    </grid-view>
  </div>
</template>

<script>
import GridView from "components/common/gridView/GridView";

export default {
  components: {
    GridView
  },
  props: {
    subcategories: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>

<style scoped>
.panel img {
  width: 100%;
}

.item {
  text-align: center;
  font-size: 12px;
}

.item-img {
  width: 80%;
}

.item-text {
  margin-top: 15px;
}
</style>