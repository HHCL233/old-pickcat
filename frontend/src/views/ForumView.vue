<template>
  <main class="container">
    <h1 class="page-title">板块</h1>
    <div class="forum-grid">
      <CategoryCard
        v-for="category in categories"
        :key="category.slug"
        :category="category"
        variant="grid"
      />
    </div>
  </main>
</template>

<script>
import CategoryCard from '../components/CategoryCard.vue'
import { loadCategories, topCategories } from '../store'

export default {
  name: 'ForumView',
  components: { CategoryCard },
  computed: {
    categories: function () {
      return topCategories()
    }
  },
  created: function () {
    loadCategories()
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.forum-grid {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin: 0 -6px;
}

.forum-grid .category-card {
  width: calc(20% - 12px);
  min-height: 160px;
  margin: 0 6px 12px;
}

@media (max-width: 1023px) {
  .forum-grid .category-card {
    width: calc(33.333% - 12px);
  }
}

@media (max-width: 767px) {
  .forum-grid .category-card {
    width: calc(50% - 12px);
    min-height: 128px;
  }
}
</style>
