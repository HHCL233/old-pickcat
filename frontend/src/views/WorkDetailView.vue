<template>
  <main class="container">
    <div class="detail-back">
      <button type="button" class="back-btn" @click="goBack">
        <AppIcon name="chevron-left" :size="16" />
        <span>返回</span>
      </button>
    </div>

    <div v-if="loading" class="card">
      <div class="skeleton-line w40"></div>
      <div class="skeleton-line w80"></div>
      <div class="skeleton-line w60"></div>
    </div>

    <div v-else-if="error" class="empty-state">
      <strong>作品加载失败</strong>
      {{ error }}
      <div class="state-action">
        <button type="button" class="btn btn-primary btn-sm" @click="load">重新加载</button>
      </div>
    </div>

    <div v-else-if="work" class="work-detail">
      <div class="work-detail-cover" :style="coverStyle">
        <span v-if="!showCover" class="work-detail-cover-fallback">{{ letter }}</span>
      </div>

      <div class="work-detail-info">
        <h1 class="work-detail-title">{{ work.title }}</h1>

        <div v-if="work.author" class="work-detail-author">
          <router-link :to="'/profile/' + work.author.id">
            <UserAvatar :user="work.author" :size="32" />
          </router-link>
          <router-link :to="'/profile/' + work.author.id" class="work-detail-author-name">
            {{ work.author.name }}
          </router-link>
          <span v-if="work.editorName" class="work-detail-editor">{{ work.editorName }}</span>
        </div>

        <div class="work-detail-stats">
          <span>
            <AppIcon name="eye" :size="16" />
            <span class="stat-num">{{ viewCount }}</span>
          </span>
          <span>
            <AppIcon name="heart" :size="16" />
            <span class="stat-num">{{ likeCount }}</span>
          </span>
          <span>
            <AppIcon name="comment" :size="16" />
            <span class="stat-num">{{ commentCount }}</span>
          </span>
        </div>

        <p v-if="work.description" class="work-detail-desc">{{ work.description }}</p>

        <a
          class="btn btn-primary work-detail-open"
          :href="originalUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          在原站打开作品
          <AppIcon name="external" :size="16" class="open-icon" />
        </a>
      </div>
    </div>

    <div v-if="work && operationText" class="card work-operation">
      <h2 class="work-operation-title">操作说明</h2>
      <p class="work-operation-text">{{ operationText }}</p>
    </div>
  </main>
</template>

<script>
import AppIcon from '../components/AppIcon.vue'
import UserAvatar from '../components/UserAvatar.vue'
import { getWork } from '../api'
import { normalizeWork, formatCount, initialOf } from '../utils/format'
import { supportsWebp } from '../utils/webp'

export default {
  name: 'WorkDetailView',
  components: { AppIcon, UserAvatar },
  props: {
    id: { type: String, required: true }
  },
  data: function () {
    return {
      raw: null,
      work: null,
      operationText: '',
      loading: true,
      error: ''
    }
  },
  computed: {
    showCover: function () {
      if (!this.work || !this.work.cover) return false
      if (supportsWebp()) return true
      return /\.(gif|png|jpe?g)(\?|$)/i.test(this.work.cover)
    },
    coverStyle: function () {
      if (!this.showCover) return {}
      return {
        backgroundImage: 'url("' + this.work.cover.replace(/"/g, '%22') + '")'
      }
    },
    letter: function () {
      return initialOf(this.work ? this.work.title : '')
    },
    viewCount: function () {
      return formatCount(this.raw ? this.raw.viewCount : 0)
    },
    likeCount: function () {
      return formatCount(this.raw ? this.raw.likeCount : 0)
    },
    commentCount: function () {
      return formatCount(this.raw ? this.raw.commentCount : 0)
    },
    originalUrl: function () {
      return 'https://pickcat.dao3.fun/works/' + this.id
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
  methods: {
    load: function () {
      var self = this
      this.loading = true
      this.error = ''
      this.raw = null
      this.work = null
      getWork(this.id)
        .then(function (data) {
          self.raw = data
          self.work = normalizeWork(data)
          self.operationText = data.operation || ''
          if (self.work) document.title = self.work.title + ' - PICKCAT'
        })
        .catch(function (err) {
          self.error = err.message || '加载失败'
        })
        .then(function () {
          self.loading = false
        })
    },
    goBack: function () {
      if (window.history.length > 1) this.$router.back()
      else this.$router.push('/works')
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.detail-back {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-height: 40px;
  margin-bottom: 12px;
}

.back-btn {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 36px;
  padding: 0 10px 0 2px;
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

.work-detail {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  margin-bottom: 16px;
}

.work-detail-cover {
  position: relative;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 56%;
  flex: 0 0 56%;
  height: 0;
  padding-top: 56%;
  margin-right: 24px;
  border-radius: $radius;
  background-color: #d4d4d4;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.work-detail-cover-fallback {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin: -40px 0 0 -40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.32);
  color: #fff;
  font-size: 34px;
  font-weight: 800;
  line-height: 80px;
  text-align: center;
}

.work-detail-info {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-width: 0;
  padding-top: 8px;
}

.work-detail-title {
  color: $text-strong;
  font-size: 32px;
  line-height: 1.25;
  font-weight: 800;
  word-break: break-word;
}

.work-detail-author {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 16px;
}

.work-detail-author-name {
  margin-left: 8px;
  color: $text;
  font-size: 14px;
  font-weight: 600;
}

.work-detail-author-name:hover {
  color: $brand;
}

.work-detail-editor {
  margin-left: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: $bg-hover;
  color: $text-muted;
  font-size: 12px;
}

.work-detail-stats {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 16px;
  color: $text-muted;
  font-size: 14px;
}

.work-detail-stats > span {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-right: 20px;
}

.stat-num {
  margin-left: 5px;
}

.work-detail-desc {
  margin-top: 18px;
  color: $text-soft;
  font-size: 14px;
  line-height: 1.7;
  max-height: 100px;
  overflow: hidden;
}

.work-detail-open {
  margin-top: 22px;
}

.open-icon {
  margin-left: 6px;
}

.work-operation {
  margin-top: 8px;
}

.work-operation-title {
  margin-bottom: 10px;
  color: $text-strong;
  font-size: 18px;
  font-weight: 700;
}

.work-operation-text {
  color: $text-soft;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
}

.state-action {
  margin-top: 14px;
}

.theme-dark .work-detail-title,
.theme-dark .work-operation-title {
  color: #fff;
}

.theme-dark .work-detail-desc,
.theme-dark .work-operation-text {
  color: $dark-muted;
}

.theme-dark .work-detail-editor {
  background: #333;
  color: $dark-muted;
}

.theme-dark .back-btn {
  color: $dark-muted;
}

.theme-dark .back-btn:hover {
  background: $dark-card;
  color: #fff;
}

@media (max-width: 767px) {
  .work-detail {
    display: block;
  }

  .work-detail-cover {
    width: 100%;
    padding-top: 100%;
    margin-right: 0;
    margin-bottom: 16px;
  }

  .work-detail-title {
    font-size: 24px;
  }
}
</style>
