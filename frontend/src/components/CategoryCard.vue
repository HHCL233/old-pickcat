<template>
  <router-link
    v-if="variant === 'grid'"
    class="category-card"
    :class="'tone-' + tone"
    :to="'/forum/category/' + category.slug"
  >
    <span class="category-name">{{ category.name }}</span>
    <span class="category-desc">{{ category.description }}</span>
    <span class="category-icon">
      <AppIcon :name="icon" :size="26" />
    </span>
  </router-link>

  <router-link
    v-else
    class="category-item"
    :class="{ active: category.slug === currentSlug }"
    :to="'/forum/category/' + category.slug"
  >
    <span class="category-item-icon">
      <AppIcon :name="icon" :size="18" />
    </span>
    <span class="category-item-name">{{ category.name }}</span>
    <AppIcon name="chevron-right" :size="16" class="category-item-arrow" />
  </router-link>
</template>

<script>
import AppIcon from './AppIcon.vue'
import { categoryIcon, categoryColor } from '../utils/categories'

export default {
  name: 'CategoryCard',
  components: { AppIcon },
  props: {
    category: { type: Object, required: true },
    variant: { type: String, default: 'grid' },
    currentSlug: { type: String, default: '' }
  },
  computed: {
    icon: function () {
      return categoryIcon(this.category.slug)
    },
    tone: function () {
      return categoryColor(this.category.slug)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.category-card {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  min-height: 112px;
  padding: 14px;
  border-radius: $radius;
  background: $bg-card;
  overflow: hidden;
  transition: background-color 0.15s;
}

.category-card:hover {
  background: $bg-soft;
}

.category-name {
  color: $text-strong;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.category-desc {
  margin-top: 4px;
  padding-right: 24px;
  color: $text-muted;
  font-size: 11px;
  line-height: 16px;
}

.category-icon {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-top: auto;
  margin-left: auto;
  border-radius: $radius-sm;
}

.tone-info .category-icon {
  background: rgba(59, 130, 246, 0.1);
  color: $info;
}

.tone-violet .category-icon {
  background: rgba(139, 92, 246, 0.1);
  color: $violet;
}

.tone-warning .category-icon {
  background: rgba(245, 158, 11, 0.1);
  color: $warning;
}

.category-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 48px;
  padding: 0 14px;
  margin-bottom: 8px;
  border-radius: $radius;
  background: $bg-card;
  color: $text;
  font-size: 14px;
  font-weight: 600;
}

.category-item:hover {
  background: $bg-soft;
}

.category-item.active {
  color: $brand;
}

.category-item-icon {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-right: 10px;
  border-radius: 6px;
  background: $bg-hover;
  color: $text-muted;
}

.category-item-name {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.category-item-arrow {
  color: $text-dim;
}

.theme-dark .category-card,
.theme-dark .category-item {
  background: $dark-card;
}

.theme-dark .category-card:hover,
.theme-dark .category-item:hover {
  background: #2e2e2e;
}

.theme-dark .category-name {
  color: #fff;
}

.theme-dark .category-desc {
  color: $dark-muted;
}

.theme-dark .category-item {
  color: $dark-text;
}

.theme-dark .category-item-icon {
  background: #333;
  color: $dark-muted;
}

.theme-dark .category-item-arrow {
  color: $dark-dim;
}
</style>
