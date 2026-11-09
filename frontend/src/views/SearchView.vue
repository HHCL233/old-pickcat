<template>
  <main class="container">
    <div class="search-head">
      <h1 class="search-query">{{ query || '搜索' }}</h1>
      <p v-if="query" class="search-summary">
        共找到 {{ totalCount }} 条相关内容
      </p>
    </div>

    <div class="search-layout">
      <aside class="search-aside">
        <div class="search-filter">
          <button
            v-for="item in filters"
            :key="item.value"
            type="button"
            class="search-filter-item"
            :class="{ active: tab === item.value }"
            @click="tab = item.value"
          >
            <span class="search-filter-name">{{ item.label }}</span>
            <span v-if="counts[item.value]" class="search-filter-count">{{ counts[item.value] }}</span>
          </button>
        </div>
      </aside>

      <section class="search-results">
        <div v-if="!query" class="empty-state">
          <strong>搜索 PICKCAT</strong>
          输入关键词，查找帖子、用户和作品。
        </div>

        <div v-else-if="loading" class="card">
          <div class="skeleton-line w60"></div>
          <div class="skeleton-line w80"></div>
          <div class="skeleton-line w40"></div>
        </div>

        <div v-else-if="error" class="empty-state">
          <strong>搜索失败</strong>
          {{ error }}
          <div class="state-action">
            <button type="button" class="btn btn-primary btn-sm" @click="runSearch">重新搜索</button>
          </div>
        </div>

        <template v-else>
          <section v-if="showTopics" class="search-section">
            <div class="section-head">
              <h2 class="section-title">帖子</h2>
              <button
                v-if="tab === 'all' && topics.length"
                type="button"
                class="see-all"
                @click="tab = 'topics'"
              >查看全部</button>
            </div>
            <div v-if="topics.length">
              <TopicCard v-for="topic in visibleTopics" :key="topic.id" :topic="topic" />
            </div>
            <div v-else class="empty-state search-empty">没有找到相关帖子</div>
          </section>

          <section v-if="showWorks" class="search-section">
            <div class="section-head">
              <h2 class="section-title">作品</h2>
              <button
                v-if="tab === 'all' && works.length"
                type="button"
                class="see-all"
                @click="tab = 'works'"
              >查看全部</button>
            </div>
            <div v-if="works.length" class="search-works">
              <WorkCard v-for="work in visibleWorks" :key="work.id" :work="work" />
            </div>
            <div v-else class="empty-state search-empty">没有找到相关作品</div>
          </section>

          <section v-if="showUsers" class="search-section">
            <div class="section-head">
              <h2 class="section-title">用户</h2>
              <button
                v-if="tab === 'all' && users.length"
                type="button"
                class="see-all"
                @click="tab = 'users'"
              >查看全部</button>
            </div>
            <div v-if="users.length" class="search-users">
              <router-link
                v-for="user in visibleUsers"
                :key="user.id"
                class="search-user"
                :to="'/profile/' + user.id"
              >
                <UserAvatar :user="user" :size="44" />
                <span class="search-user-info">
                  <strong class="search-user-name">{{ user.username }}</strong>
                  <span class="search-user-bio">{{ user.bio || '该训练师还没有填写简介' }}</span>
                </span>
                <span v-if="user.region" class="search-user-region">{{ user.region }}</span>
              </router-link>
            </div>
            <div v-else class="empty-state search-empty">没有找到相关用户</div>
          </section>
        </template>
      </section>
    </div>
  </main>
</template>

<script>
import TopicCard from '../components/TopicCard.vue'
import WorkCard from '../components/WorkCard.vue'
import UserAvatar from '../components/UserAvatar.vue'
import { searchTopics, searchWorks, searchUsers } from '../api'
import { normalizeWork } from '../utils/format'

export default {
  name: 'SearchView',
  components: { TopicCard, WorkCard, UserAvatar },
  data: function () {
    return {
      tab: 'all',
      topics: [],
      works: [],
      users: [],
      topicCount: 0,
      workCount: 0,
      userCount: 0,
      loading: false,
      error: '',
      filters: [
        { value: 'all', label: '全部' },
        { value: 'topics', label: '帖子' },
        { value: 'works', label: '作品' },
        { value: 'users', label: '用户' }
      ]
    }
  },
  computed: {
    query: function () {
      return (this.$route.query.q || '').toString()
    },
    counts: function () {
      return {
        all: this.topicCount,
        topics: this.topicCount,
        works: this.workCount,
        users: this.userCount
      }
    },
    totalCount: function () {
      var total = this.topicCount + this.workCount + this.userCount
      return total
    },
    showTopics: function () {
      return this.tab === 'all' || this.tab === 'topics'
    },
    showWorks: function () {
      return this.tab === 'all' || this.tab === 'works'
    },
    showUsers: function () {
      return this.tab === 'all' || this.tab === 'users'
    },
    visibleTopics: function () {
      return this.tab === 'all' ? this.topics.slice(0, 5) : this.topics
    },
    visibleWorks: function () {
      return this.tab === 'all' ? this.works.slice(0, 4) : this.works
    },
    visibleUsers: function () {
      return this.tab === 'all' ? this.users.slice(0, 5) : this.users
    }
  },
  watch: {
    query: function () {
      this.tab = 'all'
      this.runSearch()
    }
  },
  created: function () {
    this.runSearch()
    document.title = '搜索 - PICKCAT'
  },
  methods: {
    runSearch: function () {
      var self = this
      var query = this.query.trim()
      if (!query) {
        this.topics = []
        this.works = []
        this.users = []
        this.topicCount = 0
        this.workCount = 0
        this.userCount = 0
        this.loading = false
        this.error = ''
        return
      }

      this.loading = true
      this.error = ''

      var empty = { items: [], resultCount: null }
      Promise.all([
        searchTopics(query, { limit: 20 }).catch(function () { return empty }),
        searchWorks(query, { limit: 20 }).catch(function () { return empty }),
        searchUsers(query, { limit: 20 }).catch(function () { return empty })
      ]).then(function (results) {
        var topicData = results[0] || empty
        var workData = results[1] || empty
        var userData = results[2] || empty
        self.topics = topicData.items || []
        self.works = (workData.items || []).map(normalizeWork)
        self.users = userData.items || []
        self.topicCount = countOf(topicData)
        self.workCount = countOf(workData)
        self.userCount = countOf(userData)
      }).catch(function (err) {
        self.error = err.message || '搜索失败'
      }).then(function () {
        self.loading = false
      })
    }
  }
}

function countOf (data) {
  if (!data || !data.resultCount) return (data && data.items ? data.items.length : 0)
  return data.resultCount.value || 0
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.search-head {
  margin-bottom: 18px;
}

.search-query {
  color: $text-strong;
  font-size: 22px;
  line-height: 1.35;
  font-weight: 700;
  word-break: break-word;
}

.search-summary {
  margin-top: 4px;
  color: $text-muted;
  font-size: 13px;
}

.search-layout {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
}

.search-aside {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 288px;
  flex: 0 0 288px;
  width: 288px;
  margin-right: 24px;
}

.search-filter {
  padding: 8px;
  border-radius: $radius;
  background: $bg-card;
}

.search-filter-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 0;
  border-radius: $radius-sm;
  background: transparent;
  color: $text;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
}

.search-filter-item:hover {
  background: $bg-hover;
}

.search-filter-item.active {
  background: $brand-soft;
  color: $brand;
  font-weight: 600;
}

.search-filter-name {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
}

.search-filter-count {
  color: $text-dim;
  font-size: 12px;
}

.search-filter-item.active .search-filter-count {
  color: $brand;
}

.search-results {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-width: 0;
}

.search-section {
  margin-bottom: 28px;
}

.see-all {
  margin-left: auto;
  padding: 4px 0;
  border: 0;
  background: transparent;
  color: $brand;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.search-works {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin: 0 -6px;
}

.search-works .work-card {
  width: calc(25% - 12px);
  margin: 0 6px 12px;
}

.search-users {
  border-radius: $radius;
  overflow: hidden;
  background: $bg-card;
}

.search-user {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid $border;
}

.search-user:last-child {
  border-bottom: 0;
}

.search-user:hover {
  background: $bg-soft;
}

.search-user-info {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-width: 0;
  margin-left: 12px;
}

.search-user-name {
  display: block;
  color: $text-strong;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.search-user-bio {
  display: block;
  margin-top: 2px;
  color: $text-muted;
  font-size: 12px;
  line-height: 1.5;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.search-user-region {
  margin-left: 12px;
  color: $text-dim;
  font-size: 12px;
  white-space: nowrap;
}

.search-empty {
  padding: 32px 16px;
}

.state-action {
  margin-top: 14px;
}

.theme-dark .search-query {
  color: #fff;
}

.theme-dark .search-filter,
.theme-dark .search-users {
  background: $dark-card;
}

.theme-dark .search-filter-item {
  color: $dark-text;
}

.theme-dark .search-filter-item:hover {
  background: #333;
}

.theme-dark .search-filter-item.active {
  background: #3b1b1a;
  color: $brand;
}

.theme-dark .search-user {
  border-bottom-color: $dark-border;
}

.theme-dark .search-user:hover {
  background: #2e2e2e;
}

.theme-dark .search-user-name {
  color: #fff;
}

@media (max-width: 1023px) {
  .search-aside {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 220px;
    flex: 0 0 220px;
    width: 220px;
  }

  .search-works .work-card {
    width: calc(33.333% - 12px);
  }
}

@media (max-width: 767px) {
  .search-layout {
    display: block;
  }

  .search-aside {
    width: 100%;
    margin-right: 0;
    margin-bottom: 16px;
  }

  .search-filter {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 4px;
  }

  .search-filter-item {
    -webkit-box-flex: 1;
    -ms-flex: 1 1 0;
    flex: 1 1 0;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    padding: 0 4px;
    font-size: 13px;
  }

  .search-filter-count {
    display: none;
  }

  .search-works .work-card {
    width: calc(50% - 12px);
  }
}
</style>
