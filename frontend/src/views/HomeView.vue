<template>
  <main class="container">
    <div class="layout">
      <section class="layout-main">
        <div class="feed-head">
          <router-link to="/forum" class="feed-category-link mobile-only">板块</router-link>
          <div class="tabs" role="group" aria-label="首页排序">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              type="button"
              class="tab"
              :class="{ active: sort === tab.value }"
              @click="changeSort(tab.value)"
            >{{ tab.label }}</button>
          </div>
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

        <div v-else-if="requiresLogin" class="empty-state">
          <strong>登录后查看关注内容</strong>
          关注你感兴趣的作者，最新动态会出现在这里。
          <div class="state-action">
            <router-link class="btn btn-primary btn-sm" :to="{ path: '/login', query: { redirect: '/' } }">去登录</router-link>
          </div>
        </div>

        <div v-else-if="!items.length" class="empty-state">
          <strong>暂时没有帖子</strong>
          稍后再来看看吧。
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
        <AppSidebar :categories="categories" mode="home" />
      </aside>
    </div>
  </main>
</template>

<script>
import TopicCard from '../components/TopicCard.vue'
import AppSidebar from '../components/AppSidebar.vue'
import { getTopicFeed } from '../api'
import { state, loadCategories, topCategories } from '../store'

export default {
  name: 'HomeView',
  components: { TopicCard, AppSidebar },
  data: function () {
    return {
      sort: 'recommended',
      tabs: [
        { value: 'following', label: '关注' },
        { value: 'recommended', label: '推荐' },
        { value: 'latest', label: '最新' }
      ],
      items: [],
      cursor: null,
      loading: false,
      loadingMore: false,
      error: '',
      requiresLogin: false,
      requestId: 0
    }
  },
  computed: {
    categories: function () {
      return topCategories()
    }
  },
  created: function () {
    loadCategories()
    this.load(true)
  },
  methods: {
    changeSort: function (value) {
      if (this.sort === value) return
      this.sort = value
      this.load(true)
    },
    load: function (reset) {
      var self = this
      var requestId = ++this.requestId
      if (reset) {
        this.loading = true
        this.items = []
        this.cursor = null
        this.error = ''
        this.requiresLogin = false
      } else {
        if (!this.cursor || this.loadingMore) return
        this.loadingMore = true
      }

      var params = { limit: 20 }
      if (this.sort === 'following') {
        params.sort = 'recommended'
        params.scope = 'following'
      } else {
        params.sort = this.sort
      }
      if (!reset) params.cursor = this.cursor

      getTopicFeed(params)
        .then(function (data) {
          if (requestId !== self.requestId) return
          var list = (data && data.items) || []
          self.items = reset ? list : self.items.concat(list)
          self.cursor = data && data.pageInfo ? data.pageInfo.nextCursor : null
        })
        .catch(function (err) {
          if (requestId !== self.requestId) return
          if (err.status === 401 && self.sort === 'following') {
            self.requiresLogin = true
            self.items = []
          } else {
            self.error = err.message || '加载失败'
          }
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

.feed-head {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-height: 44px;
  margin-bottom: 12px;
}

.feed-category-link {
  padding: 8px 8px 8px 0;
  color: $text-muted;
  font-size: 15px;
  font-weight: 500;
}

.state-action {
  margin-top: 14px;
}

@media (max-width: 767px) {
  .feed-head {
    margin-bottom: 8px;
  }
}
</style>
