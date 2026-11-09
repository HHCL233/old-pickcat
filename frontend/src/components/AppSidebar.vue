<template>
  <div class="app-sidebar">
    <router-link class="share-btn" to="/forum/editor?type=create">
      <AppIcon name="external" :size="18" />
      <span>分享你的想法</span>
    </router-link>

    <section v-if="mode === 'home'" class="side-block">
      <div class="category-grid">
        <CategoryCard
          v-for="category in visibleCategories"
          :key="category.slug"
          :category="category"
          variant="grid"
        />
      </div>
    </section>

    <section v-else class="side-block">
      <div class="category-list">
        <CategoryCard
          v-for="category in otherCategories"
          :key="category.slug"
          :category="category"
          variant="list"
          :current-slug="currentSlug"
        />
      </div>
    </section>

    <section v-if="mode === 'home'" class="side-block">
      <h2 class="side-title">创作</h2>
      <div class="platform-list">
        <a
          v-for="platform in platforms"
          :key="platform.name"
          class="platform-item"
          :href="platform.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img class="platform-icon" :src="platform.icon" :alt="platform.name">
          <span class="platform-name">{{ platform.name }}</span>
          <AppIcon name="chevron-right" :size="16" class="platform-arrow" />
        </a>
      </div>
    </section>
  </div>
</template>

<script>
import AppIcon from './AppIcon.vue'
import CategoryCard from './CategoryCard.vue'

export default {
  name: 'AppSidebar',
  components: { AppIcon, CategoryCard },
  props: {
    categories: { type: Array, default: function () { return [] } },
    currentSlug: { type: String, default: '' },
    mode: { type: String, default: 'home' }
  },
  data: function () {
    return {
      platforms: [
        { name: 'KittenN', url: 'https://kn.codemao.cn', icon: '/images/editors/kn.png' },
        { name: 'CoCo编辑器', url: 'https://coco.codemao.cn', icon: '/images/editors/coco.png' },
        { name: '海龟编辑器', url: 'https://turtle.codemao.cn', icon: '/images/editors/turtle.png' }
      ]
    }
  },
  computed: {
    visibleCategories: function () {
      return this.categories.slice(0, 5)
    },
    otherCategories: function () {
      var current = this.currentSlug
      return this.categories.filter(function (item) {
        return item.slug !== current
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.app-sidebar {
  min-width: 0;
}

.share-btn {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  height: 48px;
  margin-bottom: 24px;
  border-radius: $radius-sm;
  background: $brand;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.share-btn:hover {
  background: $brand-hover;
}

.share-btn .icon {
  margin-right: 8px;
}

.side-block {
  margin-bottom: 24px;
}

.category-grid {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin: 0 -6px;
}

.category-grid .category-card {
  width: calc(50% - 12px);
  margin: 0 6px 12px;
}

.category-grid .category-card:last-child {
  width: calc(100% - 12px);
}

.side-title {
  margin-bottom: 10px;
  padding: 0 8px;
  color: $text-strong;
  font-size: 16px;
  font-weight: 700;
}

.platform-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 48px;
  padding: 0 12px;
  margin-bottom: 8px;
  border-radius: $radius;
  background: $bg-card;
  color: $text;
  font-size: 14px;
}

.platform-item:hover {
  background: $bg-soft;
}

.platform-icon {
  width: 28px;
  height: 28px;
  margin-right: 12px;
}

.platform-name {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.platform-arrow {
  color: $text-dim;
}

.theme-dark .side-title {
  color: #fff;
}

.theme-dark .platform-item {
  background: $dark-card;
  color: $dark-text;
}

.theme-dark .platform-item:hover {
  background: #2e2e2e;
}

.theme-dark .platform-arrow {
  color: $dark-dim;
}

@media (max-width: 1023px) {
  .share-btn {
    margin-bottom: 16px;
  }
}
</style>
