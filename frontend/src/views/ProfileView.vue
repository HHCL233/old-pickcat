<template>
  <main class="container">
    <div v-if="loading" class="card">
      <div class="skeleton-line w40"></div>
      <div class="skeleton-line w80"></div>
      <div class="skeleton-line w60"></div>
    </div>

    <div v-else-if="error" class="empty-state">
      <strong>用户信息加载失败</strong>
      {{ error }}
      <div class="state-action">
        <button type="button" class="btn btn-primary btn-sm" @click="load">重新加载</button>
      </div>
    </div>

    <div v-else-if="user" class="layout">
      <aside class="layout-aside layout-aside-first profile-aside">
        <div class="profile-card">
          <div class="profile-cover" :style="coverStyle"></div>
          <div class="profile-body">
            <div class="profile-avatar">
              <UserAvatar :user="user" :size="72" />
            </div>
            <h1 class="profile-name">
              {{ user.username }}
              <span v-if="level" class="profile-level">Lv.{{ level }}</span>
            </h1>
            <p class="profile-bio">{{ user.bio || '这个训练师还没有填写简介' }}</p>
            <p class="profile-meta">
              <span v-if="user.region">{{ user.region }}</span>
              <span>{{ joinedAt }}加入</span>
            </p>
            <div class="profile-stats">
              <div class="profile-stat">
                <strong>{{ followerCount }}</strong>
                <span>粉丝</span>
              </div>
              <div class="profile-stat">
                <strong>{{ followingCount }}</strong>
                <span>正在关注</span>
              </div>
              <div class="profile-stat">
                <strong>{{ topicCount }}</strong>
                <span>帖子</span>
              </div>
              <div class="profile-stat">
                <strong>{{ replyCount }}</strong>
                <span>回复</span>
              </div>
            </div>
            <button type="button" class="btn btn-outline btn-block profile-follow" @click="follow">
              {{ user.viewerState && user.viewerState.following ? '已关注' : '关注' }}
            </button>
          </div>
        </div>
      </aside>

      <section class="layout-main layout-main-last profile-main">
        <div class="profile-tabs">
          <button
            v-for="item in tabs"
            :key="item.value"
            type="button"
            class="tab"
            :class="{ active: tab === item.value }"
            @click="tab = item.value"
          >{{ item.label }}</button>
        </div>

        <div v-if="tab === 'home'">
          <section class="profile-section">
            <h2 class="section-title">精选帖子</h2>
            <div v-if="topics.length">
              <TopicCard v-for="topic in topics.slice(0, 3)" :key="topic.id" :topic="topic" />
            </div>
            <div v-else class="empty-state profile-empty">还没有发布帖子</div>
          </section>

          <section class="profile-section">
            <h2 class="section-title">精选作品</h2>
            <div v-if="works.length" class="profile-works">
              <WorkCard v-for="work in works.slice(0, 4)" :key="work.id" :work="work" variant="compact" />
            </div>
            <div v-else class="empty-state profile-empty">还没有发布作品</div>
          </section>
        </div>

        <div v-else-if="tab === 'topics'">
          <div v-if="topics.length">
            <TopicCard v-for="topic in topics" :key="topic.id" :topic="topic" />
          </div>
          <div v-else class="empty-state profile-empty">还没有发布帖子</div>
        </div>

        <div v-else>
          <div v-if="works.length" class="profile-works">
            <WorkCard v-for="work in works" :key="work.id" :work="work" variant="compact" />
          </div>
          <div v-else class="empty-state profile-empty">还没有发布作品</div>
        </div>
      </section>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </main>
</template>

<script>
import AppIcon from '../components/AppIcon.vue'
import UserAvatar from '../components/UserAvatar.vue'
import TopicCard from '../components/TopicCard.vue'
import WorkCard from '../components/WorkCard.vue'
import { getUser, getUserTopics, getUserWorks } from '../api'
import { normalizeWork, relativeTime, formatCount, formatDate } from '../utils/format'
import { supportsWebp } from '../utils/webp'

export default {
  name: 'ProfileView',
  components: { AppIcon, UserAvatar, TopicCard, WorkCard },
  props: {
    id: { type: String, required: true }
  },
  data: function () {
    return {
      user: null,
      topics: [],
      works: [],
      loading: true,
      error: '',
      tab: 'home',
      toast: '',
      toastTimer: null,
      tabs: [
        { value: 'home', label: '主页' },
        { value: 'topics', label: '帖子' },
        { value: 'works', label: '作品' }
      ]
    }
  },
  computed: {
    coverStyle: function () {
      if (!supportsWebp()) {
        return { backgroundImage: 'linear-gradient(135deg, #ffd7a8, #ff9a9e)' }
      }
      var fileId = this.user && this.user.backgroundFileId
      if (!fileId) return { backgroundImage: 'url("/images/pages/profile-background.webp")' }
      return { backgroundImage: 'url("/api/v1/files/' + fileId + '")' }
    },
    level: function () {
      return this.user && this.user.level ? this.user.level.current : null
    },
    joinedAt: function () {
      return formatDate(this.user && this.user.createdAt)
    },
    followerCount: function () {
      return formatCount(this.user && this.user.stats ? this.user.stats.followers : 0)
    },
    followingCount: function () {
      return formatCount(this.user && this.user.stats ? this.user.stats.following : 0)
    },
    topicCount: function () {
      return formatCount(this.user && this.user.stats ? this.user.stats.topics : 0)
    },
    replyCount: function () {
      return formatCount(this.user && this.user.stats ? this.user.stats.replies : 0)
    }
  },
  watch: {
    id: function () {
      this.load()
    }
  },
  created: function () {
    this.load()
  },
  beforeDestroy: function () {
    if (this.toastTimer) clearTimeout(this.toastTimer)
  },
  methods: {
    relative: relativeTime,
    load: function () {
      var self = this
      this.loading = true
      this.error = ''
      this.user = null
      this.topics = []
      this.works = []

      Promise.all([
        getUser(this.id),
        getUserTopics(this.id, { limit: 20 }).catch(function () { return { items: [] } }),
        getUserWorks(this.id, { limit: 20 }).catch(function () { return { items: [] } })
      ])
        .then(function (results) {
          self.user = results[0]
          self.topics = (results[1] && results[1].items) || []
          self.works = ((results[2] && results[2].items) || []).map(normalizeWork)
          if (self.user) document.title = self.user.username + ' - PICKCAT'
        })
        .catch(function (err) {
          self.error = err.message || '加载失败'
        })
        .then(function () {
          self.loading = false
        })
    },
    follow: function () {
      this.showToast('请先登录后再关注')
    },
    showToast: function (message) {
      var self = this
      this.toast = message
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(function () {
        self.toast = ''
      }, 2200)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.profile-card {
  overflow: hidden;
  border-radius: $radius;
  background: $bg-card;
}

.profile-cover {
  height: 120px;
  background-color: #d4d4d4;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.profile-body {
  position: relative;
  padding: 0 16px 16px;
}

.profile-avatar {
  position: relative;
  display: inline-block;
  margin-top: -36px;
  padding: 3px;
  border-radius: 50%;
  background: $bg-card;
}

.profile-name {
  margin-top: 6px;
  color: $text-strong;
  font-size: 24px;
  line-height: 30px;
  font-weight: 700;
}

.profile-level {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 6px;
  border-radius: 4px;
  background: $bg-hover;
  color: $text-muted;
  font-size: 11px;
  font-weight: 600;
  vertical-align: 3px;
}

.profile-bio {
  margin-top: 6px;
  color: $text-muted;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
}

.profile-meta {
  margin-top: 6px;
  color: $text-dim;
  font-size: 12px;
}

.profile-meta span {
  margin-right: 10px;
}

.profile-stats {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid $border;
}

.profile-stat {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  text-align: center;
}

.profile-stat strong {
  display: block;
  color: $text-strong;
  font-size: 16px;
  line-height: 1.4;
}

.profile-stat span {
  display: block;
  color: $text-muted;
  font-size: 11px;
}

.profile-follow {
  margin-top: 16px;
}

.profile-tabs {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid $border;
}

.profile-section {
  margin-bottom: 28px;
}

.profile-section .section-title {
  margin-bottom: 12px;
}

.profile-works {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin: 0 -6px;
}

.profile-works .work-compact {
  width: calc(50% - 12px);
  margin: 0 6px 12px;
}

.profile-empty {
  padding: 32px 16px;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 88px;
  z-index: 100;
  padding: 10px 18px;
  margin-left: -90px;
  width: 180px;
  border-radius: $radius-sm;
  background: rgba(23, 23, 23, 0.88);
  color: #fff;
  font-size: 13px;
  text-align: center;
}

.theme-dark .profile-card {
  background: $dark-card;
}

.theme-dark .profile-avatar {
  background: $dark-card;
}

.theme-dark .profile-name,
.theme-dark .profile-stat strong {
  color: #fff;
}

.theme-dark .profile-stats,
.theme-dark .profile-tabs {
  border-color: $dark-border;
}

.theme-dark .profile-level {
  background: #333;
  color: $dark-muted;
}

.state-action {
  margin-top: 14px;
}

@media (max-width: 1023px) {
  .profile-aside {
    width: 100%;
    margin-bottom: 16px;
  }

  .profile-card {
    max-width: 420px;
  }
}

@media (max-width: 767px) {
  .profile-works .work-compact {
    width: calc(100% - 12px);
  }
}
</style>
