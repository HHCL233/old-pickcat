<template>
  <main class="container">
    <section class="works-featured">
      <div class="works-label">
        <AppIcon name="works" :size="16" class="works-label-icon" />
        <span>PICK 作品</span>
      </div>

      <div v-if="bannersLoading" class="banner-loading">
        <div class="banner-main-skeleton"></div>
        <div class="banner-side-skeleton">
          <div v-for="n in 4" :key="n" class="banner-cell-skeleton"></div>
        </div>
      </div>

      <div v-else-if="banners.length" class="banner-layout">
        <div class="banner-main">
          <WorkCard :work="banners[0]" variant="banner" />
        </div>
        <div class="banner-side">
          <div v-for="work in sideBanners" :key="work.id" class="banner-cell">
            <WorkCard :work="work" variant="banner" />
          </div>
        </div>
      </div>
    </section>

    <section class="works-discover">
      <div class="section-head works-discover-head">
        <h2 class="section-title">发现作品</h2>
        <div class="tabs" role="group" aria-label="作品排序">
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

      <div v-if="loading" class="works-grid">
        <div v-for="n in 8" :key="n" class="work-card-skeleton">
          <div class="work-skeleton-cover"></div>
          <div class="work-skeleton-body">
            <div class="skeleton-line w80 short"></div>
            <div class="skeleton-line w40 short"></div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="empty-state">
        <strong>作品加载失败</strong>
        {{ error }}
        <div class="state-action">
          <button type="button" class="btn btn-primary btn-sm" @click="load(true)">重新加载</button>
        </div>
      </div>

      <div v-else-if="requiresLogin" class="empty-state">
        <strong>登录后查看关注作品</strong>
        关注创作者，第一时间看到他们的新作品。
        <div class="state-action">
          <router-link class="btn btn-primary btn-sm" :to="{ path: '/login', query: { redirect: '/works' } }">去登录</router-link>
        </div>
      </div>

      <div v-else-if="!items.length" class="empty-state">
        <strong>暂时没有作品</strong>
        稍后再来看看吧。
      </div>

      <div v-else class="works-grid">
        <WorkCard v-for="work in items" :key="work.id" :work="work" />
      </div>

      <div v-if="!loading && !error && !requiresLogin && cursor" class="load-more-wrap">
        <button type="button" class="btn btn-outline btn-sm" :disabled="loadingMore" @click="load(false)">
          {{ loadingMore ? '加载中…' : '加载更多' }}
        </button>
      </div>
    </section>
  </main>
</template>

<script>
import AppIcon from '../components/AppIcon.vue'
import WorkCard from '../components/WorkCard.vue'
import { getWorkFeed, getFeaturedWorks } from '../api'
import { normalizeWork } from '../utils/format'

export default {
  name: 'WorksView',
  components: { AppIcon, WorkCard },
  data: function () {
    return {
      sort: 'recommended',
      tabs: [
        { value: 'following', label: '关注' },
        { value: 'recommended', label: '推荐' },
        { value: 'latest', label: '最新' }
      ],
      banners: [],
      bannersLoading: true,
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
    sideBanners: function () {
      return this.banners.slice(1, 5)
    }
  },
  created: function () {
    this.loadBanners()
    this.load(true)
  },
  methods: {
    loadBanners: function () {
      var self = this
      this.bannersLoading = true
      getFeaturedWorks()
        .then(function (data) {
          var list = (data && data.items) || []
          self.banners = list.map(normalizeWork).filter(function (item) {
            return !!item
          })
        })
        .catch(function () {
          self.banners = []
        })
        .then(function () {
          self.bannersLoading = false
        })
    },
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

      var params = { limit: 8 }
      if (this.sort === 'following') {
        params.sort = 'recommended'
        params.scope = 'following'
      } else {
        params.sort = this.sort
      }
      if (!reset) params.cursor = this.cursor

      getWorkFeed(params)
        .then(function (data) {
          if (requestId !== self.requestId) return
          var list = ((data && data.items) || []).map(normalizeWork)
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

.works-featured {
  margin-bottom: 32px;
}

.works-label {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-bottom: 12px;
  color: $brand;
  font-size: 15px;
  font-weight: 700;
}

.works-label-icon {
  margin-right: 6px;
}

.banner-layout {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
}

.banner-main {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 58%;
  flex: 1 1 58%;
  min-width: 0;
  margin-right: 12px;
}

.banner-main .work-banner {
  height: 492px;
}

.banner-side {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 42%;
  flex: 0 0 42%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin: 0 -6px -12px;
}

.banner-cell {
  width: calc(50% - 12px);
  margin: 0 6px 12px;
}

.banner-cell .work-banner {
  height: 240px;
}

.banner-loading {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.banner-main-skeleton {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 58%;
  flex: 1 1 58%;
  height: 492px;
  margin-right: 12px;
  border-radius: $radius;
  background: #e5e5e5;
}

.banner-side-skeleton {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 42%;
  flex: 0 0 42%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin: 0 -6px -12px;
}

.banner-cell-skeleton {
  width: calc(50% - 12px);
  height: 240px;
  margin: 0 6px 12px;
  border-radius: $radius;
  background: #e5e5e5;
}

.works-discover-head {
  margin-bottom: 12px;
}

.works-grid {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin: 0 -6px;
}

.works-grid .work-card {
  width: calc(25% - 12px);
  margin: 0 6px 12px;
}

.work-card-skeleton {
  width: calc(25% - 12px);
  margin: 0 6px 12px;
  border-radius: $radius;
  overflow: hidden;
  background: $bg-card;
}

.work-skeleton-cover {
  height: 0;
  padding-top: 100%;
  background: #e5e5e5;
}

.work-skeleton-body {
  padding: 10px 12px 12px;
}

.state-action {
  margin-top: 14px;
}

.theme-dark .work-card-skeleton {
  background: $dark-card;
}

.theme-dark .banner-main-skeleton,
.theme-dark .banner-cell-skeleton,
.theme-dark .work-skeleton-cover {
  background: #333;
}

@media (max-width: 1023px) {
  .banner-main .work-banner {
    height: 380px;
  }

  .banner-cell .work-banner {
    height: 184px;
  }

  .works-grid .work-card,
  .work-card-skeleton {
    width: calc(33.333% - 12px);
  }
}

@media (max-width: 767px) {
  .banner-layout {
    display: block;
  }

  .banner-main {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .banner-main .work-banner {
    height: 320px;
  }

  .banner-side {
    margin-bottom: -12px;
  }

  .banner-cell .work-banner {
    height: 160px;
  }

  .works-grid .work-card,
  .work-card-skeleton {
    width: calc(50% - 12px);
  }

  .works-discover-head {
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }

  .works-discover-head .tabs {
    margin-left: auto;
  }
}
</style>
