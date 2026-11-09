<template>
  <main class="container">
    <h1 class="sr-only">{{ category ? category.name : slug }}</h1>

    <div class="layout">
      <section class="layout-main">
        <div class="category-back">
          <button type="button" class="back-btn" @click="goBack">
            <AppIcon name="chevron-left" :size="16" />
            <span>返回</span>
          </button>
        </div>

        <div v-if="loading" aria-busy="true">
          <div v-for="n in 5" :key="n" class="skeleton-card">
            <div class="skeleton-line w60"></div>
            <div class="skeleton-line w40 short"></div>
            <div class="skeleton-line w80"></div>
            <div class="skeleton-line w40 short"></div>
          </div>
        </div>

        <div v-else-if="error" class="empty-state">
          <strong>帖子加载失败</strong>
          {{ error }}
          <div class="state-action">
            <button type="button" class="btn btn-primary btn-sm" @click="load(true)">重新加载</button>
          </div>
        </div>

        <div v-else-if="!items.length" class="empty-state">
          <strong>这个板块还没有帖子</strong>
          来发布第一篇帖子吧。
        </div>

        <div v-else>
          <TopicCard v-for="topic in items" :key="topic.id" :topic="topic" />
          <div v-if="cursor" class="load-more-wrap">
            <button type="button" class="btn btn-outline btn-sm" :disabled="loadingMore" @click="load(false)">
              {{ loadingMore ? '加载中…' : '加载更多' }}
            </button>
          </div>
        </div>
      </section>

      <aside class="layout-aside sidebar-desktop">
        <AppSidebar :categories="categories" mode="category" :current-slug="slug" />
      </aside>
    </div>
  </main>
</template>

<script>
import AppIcon from '../components/AppIcon.vue'
import TopicCard from '../components/TopicCard.vue'
import AppSidebar from '../components/AppSidebar.vue'
import { getTopics } from '../api'
import { loadCategories, topCategories } from '../store'

export default {
  name: 'CategoryView',
  components: { AppIcon, TopicCard, AppSidebar },
  props: {
    slug: { type: String, required: true }
  },
  data: function () {
    return {
      items: [],
      cursor: null,
      loading: false,
      loadingMore: false,
      error: '',
      requestId: 0
    }
  },
  computed: {
    categories: function () {
      return topCategories()
    },
    category: function () {
      var slug = this.slug
      var list = this.categories
      for (var i = 0; i < list.length; i++) {
        if (list[i].slug === slug) return list[i]
      }
      return null
    }
  },
  watch: {
    slug: function () {
      this.load(true)
    },
    category: {
      immediate: true,
      handler: function (category) {
        if (category) document.title = category.name + ' - PICKCAT'
      }
    }
  },
  created: function () {
    loadCategories()
    this.load(true)
  },
  methods: {
    goBack: function () {
      if (window.history.length > 1) this.$router.back()
      else this.$router.push('/')
    },
    load: function (reset) {
      var self = this
      var requestId = ++this.requestId
      if (reset) {
        this.loading = true
        this.items = []
        this.cursor = null
        this.error = ''
      } else {
        if (!this.cursor || this.loadingMore) return
        this.loadingMore = true
      }

      var params = { tag: this.slug, tagMode: 'all', limit: 20 }
      if (!reset) params.cursor = this.cursor

      getTopics(params)
        .then(function (data) {
          if (requestId !== self.requestId) return
          var list = (data && data.items) || []
          self.items = reset ? list : self.items.concat(list)
          self.cursor = data && data.pageInfo ? data.pageInfo.nextCursor : null
        })
        .catch(function (err) {
          if (requestId !== self.requestId) return
          self.error = err.message || '加载失败'
        })
        .then(function () {
          if (requestId !== self.requestId) return
          self.loading = false
          self.loadingMore = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.category-back {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-height: 44px;
  margin-bottom: 12px;
}

.back-btn {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 40px;
  padding: 0 10px 0 4px;
  border: 0;
  border-radius: $radius-sm;
  background: transparent;
  color: $text-muted;
  font-size: 15px;
  cursor: pointer;
}

.back-btn:hover {
  background: $bg-hover;
  color: $text-strong;
}

.state-action {
  margin-top: 14px;
}

.theme-dark .back-btn {
  color: $dark-muted;
}

.theme-dark .back-btn:hover {
  background: $dark-card;
  color: #fff;
}
</style>
