<template>
  <main class="post-page">
    <section class="post-hero">
      <div class="post-hero-inner">
        <div class="post-back-row desktop-only">
          <button type="button" class="back-btn" @click="goBack">
            <AppIcon name="chevron-left" :size="20" />
            <span>返回</span>
          </button>
        </div>

        <template v-if="loading">
          <div class="skeleton-line w80 hero-skeleton-title"></div>
          <div class="skeleton-line w40 short"></div>
        </template>
        <template v-else-if="topic">
          <h1 class="post-title">{{ topic.title }}</h1>
          <p class="post-status">{{ user ? '参与讨论，分享你的看法' : '请先登录后再回复' }}</p>
          <div class="post-mobile-tags mobile-only">
            <router-link
              v-for="tag in tags"
              :key="tag.id || tag.slug"
              class="tag-outline"
              :to="'/forum/category/' + tag.slug"
            >#{{ tag.name }}</router-link>
          </div>
        </template>
      </div>
    </section>

    <div class="post-body container">
      <div v-if="error" class="empty-state">
        <strong>帖子加载失败</strong>
        {{ error }}
        <div class="state-action">
          <button type="button" class="btn btn-primary btn-sm" @click="load">重新加载</button>
        </div>
      </div>

      <div v-else-if="loading" class="post-loading">
        <div class="card">
          <div class="skeleton-line w40"></div>
          <div class="skeleton-line w80"></div>
          <div class="skeleton-line w60"></div>
          <div class="skeleton-line w80"></div>
        </div>
      </div>

      <div v-else-if="topic" class="layout">
        <article class="layout-main post-main">
          <div class="post-author-bar">
            <div class="post-author-left">
              <router-link v-if="topic.author" :to="'/profile/' + topic.author.id" class="post-author-avatar">
                <UserAvatar :user="topic.author" :size="36" />
              </router-link>
              <div class="post-author-info">
                <div class="post-author-name-row">
                  <router-link v-if="topic.author" :to="'/profile/' + topic.author.id">
                    <strong>{{ topic.author.username }}</strong>
                  </router-link>
                  <img
                    v-if="badgeImage && webpSupported"
                    class="badge-img"
                    :src="badgeImage"
                    :alt="badgeName"
                    :title="badgeName"
                  >
                </div>
                <span class="post-time">{{ createdTime }}</span>
              </div>
            </div>

            <div class="post-actions">
              <button type="button" class="post-action" :title="'点赞 ' + likeCount" @click="needLogin">
                <AppIcon name="heart" :size="17" />
                <span class="post-action-num">{{ likeCount }}</span>
              </button>
              <button type="button" class="post-action" title="前往评论" @click="scrollToComments">
                <AppIcon name="comment" :size="17" />
                <span class="post-action-num">{{ replyCount }}</span>
              </button>
              <button type="button" class="post-action post-action-icon" title="收藏" @click="needLogin">
                <AppIcon name="bookmark" :size="17" />
              </button>
              <button type="button" class="post-action post-action-icon" title="分享帖子" @click="share">
                <AppIcon name="share" :size="17" />
              </button>
              <button type="button" class="post-action post-action-icon" title="更多">
                <AppIcon name="more" :size="20" />
              </button>
            </div>
          </div>

          <div v-if="firstPost" class="markdown-body post-content" v-rich="firstPost.cookedHtml"></div>

          <section id="comments" class="comments">
            <div class="comments-head">
              <h2 class="comments-title">
                全部评论
                <span class="comments-count">（{{ replyCount }}）</span>
              </h2>
              <div class="tabs" role="group" aria-label="评论排序">
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  type="button"
                  class="tab"
                  :class="{ active: commentSort === option.value }"
                  @click="changeCommentSort(option.value)"
                >{{ option.label }}</button>
              </div>
            </div>

            <div v-if="!user" class="reply-login">
              请先登录后再回复
              <router-link :to="{ path: '/login', query: { redirect: $route.fullPath } }">去登录</router-link>
            </div>
            <div v-else class="reply-login">
              在下方参与讨论
            </div>

            <div v-if="commentsLoading" class="comments-loading">
              <div v-for="n in 3" :key="n" class="comment-skeleton">
                <div class="skeleton-line w40 short"></div>
                <div class="skeleton-line w80"></div>
                <div class="skeleton-line w60 short"></div>
              </div>
            </div>

            <div v-else-if="commentsError" class="empty-state comments-empty">
              <strong>评论加载失败</strong>
              {{ commentsError }}
              <div class="state-action">
                <button type="button" class="btn btn-primary btn-sm" @click="loadComments(true)">重新加载</button>
              </div>
            </div>

            <div v-else-if="!comments.length" class="empty-state comments-empty">
              <strong>还没有评论</strong>
              成为第一个回复的人吧。
            </div>

            <div v-else class="comment-list">
              <article
                v-for="comment in comments"
                :key="comment.id"
                class="comment-item"
              >
                <router-link
                  v-if="comment.author && !comment.deleted"
                  :to="'/profile/' + comment.author.id"
                  class="comment-avatar"
                >
                  <UserAvatar :user="comment.author" :size="34" />
                </router-link>
                <span v-else class="comment-avatar">
                  <UserAvatar :src="''" name="已删除" :size="34" />
                </span>

                <div class="comment-main">
                  <div class="comment-head">
                    <div class="comment-head-left">
                      <router-link
                        v-if="comment.author && !comment.deleted"
                        :to="'/profile/' + comment.author.id"
                        class="comment-author"
                      >{{ comment.author.username }}</router-link>
                      <span v-else class="comment-author">已删除用户</span>
                      <img
                        v-if="commentBadge(comment)"
                        class="badge-img"
                        :src="commentBadge(comment)"
                        alt=""
                      >
                    </div>
                    <div class="comment-meta">
                      <span class="comment-floor">#{{ comment.postNumber }}</span>
                      <span>{{ relative(comment.createdAt) }}</span>
                    </div>
                  </div>

                  <div
                    v-if="comment.cookedHtml"
                    class="markdown-body comment-content"
                    v-rich="comment.cookedHtml"
                  ></div>

                  <div class="comment-actions">
                    <button type="button" class="comment-action" @click="needLogin">
                      <AppIcon name="heart" :size="14" />
                      <span>{{ comment.likeCount || 0 }}</span>
                    </button>
                    <button type="button" class="comment-action" @click="needLogin">
                      <AppIcon name="comment" :size="14" />
                      <span>回复</span>
                    </button>
                    <button type="button" class="comment-action" @click="needLogin">
                      <AppIcon name="more" :size="16" />
                    </button>
                  </div>
                </div>
              </article>

              <div v-if="commentsCursor" class="load-more-wrap">
                <button
                  type="button"
                  class="btn btn-outline btn-sm load-more-comments"
                  :disabled="commentsLoadingMore"
                  @click="loadComments(false)"
                >{{ commentsLoadingMore ? '加载中…' : '加载更多回复' }}</button>
              </div>
            </div>
          </section>
        </article>

        <aside class="layout-aside post-aside desktop-only">
          <div class="post-tags">
            <router-link
              v-for="tag in tags"
              :key="tag.id || tag.slug"
              class="tag-outline"
              :to="'/forum/category/' + tag.slug"
            >#{{ tag.name }}</router-link>
          </div>
        </aside>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </main>
</template>

<script>
import AppIcon from '../components/AppIcon.vue'
import UserAvatar from '../components/UserAvatar.vue'
import { getTopic, getTopicPosts } from '../api'
import { state } from '../store'
import { relativeTime, formatCount } from '../utils/format'
import { supportsWebp } from '../utils/webp'

export default {
  name: 'PostView',
  components: { AppIcon, UserAvatar },
  props: {
    id: { type: String, required: true }
  },
  data: function () {
    return {
      topic: null,
      comments: [],
      commentsCursor: null,
      commentSort: 'hot',
      sortOptions: [
        { value: 'hot', label: '最热' },
        { value: 'latest', label: '最新' },
        { value: 'earliest', label: '最早' }
      ],
      loading: true,
      error: '',
      commentsLoading: false,
      commentsLoadingMore: false,
      commentsError: '',
      toast: '',
      toastTimer: null,
      commentsRequestId: 0
    }
  },
  computed: {
    user: function () {
      return state.user
    },
    webpSupported: function () {
      return supportsWebp()
    },
    tags: function () {
      return (this.topic && this.topic.tags) || []
    },
    firstPost: function () {
      return this.topic && this.topic.firstPost ? this.topic.firstPost : null
    },
    replyCount: function () {
      return formatCount(this.topic ? this.topic.replyCount : 0)
    },
    likeCount: function () {
      return formatCount(this.firstPost ? this.firstPost.likeCount : 0)
    },
    createdTime: function () {
      return relativeTime(this.topic && this.topic.createdAt)
    },
    badgeName: function () {
      var badge = this.topic && this.topic.author && this.topic.author.displayedBadge
      return badge ? badge.name : ''
    },
    badgeImage: function () {
      var badge = this.topic && this.topic.author && this.topic.author.displayedBadge
      if (!badge || !badge.image) return ''
      return badge.image.url || ('/api/v1/files/' + badge.image.fileId)
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
      this.topic = null
      this.comments = []
      this.commentsCursor = null

      getTopic(this.id)
        .then(function (topic) {
          self.topic = topic
          document.title = topic.title + ' - PICKCAT'
          self.loadComments(true)
        })
        .catch(function (err) {
          self.error = err.message || '加载失败'
        })
        .then(function () {
          self.loading = false
        })
    },
    loadComments: function (reset) {
      var self = this
      var requestId = ++this.commentsRequestId
      if (reset) {
        this.commentsLoading = true
        this.comments = []
        this.commentsCursor = null
        this.commentsError = ''
      } else {
        if (!this.commentsCursor || this.commentsLoadingMore) return
        this.commentsLoadingMore = true
      }

      var params = { sort: this.commentSort, limit: 20 }
      if (!reset) params.cursor = this.commentsCursor

      getTopicPosts(this.id, params)
        .then(function (data) {
          if (requestId !== self.commentsRequestId) return
          var list = (data && data.items) || []
          self.comments = reset ? list : self.comments.concat(list)
          self.commentsCursor = data && data.pageInfo ? data.pageInfo.nextCursor : null
        })
        .catch(function (err) {
          if (requestId !== self.commentsRequestId) return
          self.commentsError = err.message || '评论加载失败'
        })
        .then(function () {
          if (requestId !== self.commentsRequestId) return
          self.commentsLoading = false
          self.commentsLoadingMore = false
        })
    },
    changeCommentSort: function (value) {
      if (this.commentSort === value) return
      this.commentSort = value
      this.loadComments(true)
    },
    goBack: function () {
      if (window.history.length > 1) this.$router.back()
      else this.$router.push('/')
    },
    scrollToComments: function () {
      var el = document.getElementById('comments')
      if (!el) return
      var top = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - 80
      window.scrollTo(0, top)
    },
    commentBadge: function (comment) {
      if (!supportsWebp()) return ''
      var badge = comment && comment.author && comment.author.displayedBadge
      if (!badge || !badge.image) return ''
      return badge.image.url || ('/api/v1/files/' + badge.image.fileId)
    },
    needLogin: function () {
      if (this.user) {
        this.showToast('交互功能在还原版本中暂未开放')
      } else {
        this.showToast('请先登录')
      }
    },
    showToast: function (message) {
      var self = this
      this.toast = message
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(function () {
        self.toast = ''
      }, 2200)
    },
    share: function () {
      var self = this
      var url = window.location.href
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          self.showToast('链接已复制')
        }, function () {
          self.showToast('复制失败，请手动复制地址栏链接')
        })
        return
      }
      try {
        var input = document.createElement('textarea')
        input.value = url
        input.setAttribute('readonly', 'readonly')
        input.style.position = 'fixed'
        input.style.left = '-9999px'
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        this.showToast('链接已复制')
      } catch (e) {
        this.showToast('复制失败，请手动复制地址栏链接')
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.post-page {
  position: relative;
  min-height: 60vh;
}

.post-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 560px;
  background: #f8f2dd url('/images/forum/post-detail-banner.png') center top no-repeat;
  background-size: 100% auto;
  z-index: 0;
}

.post-page::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 560px;
  background: -webkit-linear-gradient(top, rgba(245, 245, 245, 0) 8%, rgba(245, 245, 245, 0.35) 26%, rgba(245, 245, 245, 0.75) 48%, #f5f5f5 72%);
  background: linear-gradient(to bottom, rgba(245, 245, 245, 0) 8%, rgba(245, 245, 245, 0.35) 26%, rgba(245, 245, 245, 0.75) 48%, #f5f5f5 72%);
  z-index: 0;
}

.post-hero,
.post-body {
  position: relative;
  z-index: 1;
}

.post-hero {
  padding-bottom: 32px;
}

.post-hero-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 32px 0;
}

.post-back-row {
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
  padding: 0 10px 0 2px;
  border: 0;
  border-radius: $radius-sm;
  background: transparent;
  color: $text-muted;
  font-size: 16px;
  cursor: pointer;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.6);
  color: $text-strong;
}

.back-btn .icon {
  margin-right: 4px;
}

.post-title {
  max-width: 1216px;
  color: $text-strong;
  font-size: 52px;
  line-height: 1.12;
  font-weight: 800;
  letter-spacing: -0.3px;
  word-wrap: break-word;
  word-break: break-word;
}

.post-status {
  margin-top: 8px;
  max-width: 820px;
  color: $text-muted;
  font-size: 14px;
  line-height: 20px;
}

.post-mobile-tags {
  margin-top: 12px;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.hero-skeleton-title {
  height: 40px;
  margin-top: 52px;
}

.post-body {
  max-width: 1280px;
  padding-top: 24px;
}

.post-loading {
  max-width: 904px;
}

.post-author-bar {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid $border;
}

.post-author-left {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-width: 0;
}

.post-author-avatar {
  display: block;
  margin-right: 12px;
}

.post-author-info {
  min-width: 0;
}

.post-author-name-row {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: $text-strong;
  font-size: 16px;
  line-height: 24px;
}

.post-author-name-row a:hover {
  color: $brand;
}

.post-time {
  display: block;
  color: $text-muted;
  font-size: 12px;
  line-height: 20px;
}

.post-actions {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  flex-shrink: 0;
}

.post-action {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 36px;
  padding: 0 10px;
  margin-left: 2px;
  border: 0;
  border-radius: $radius-sm;
  background: transparent;
  color: $text-muted;
  font-size: 14px;
  cursor: pointer;
}

.post-action:hover {
  background: rgba(255, 255, 255, 0.7);
  color: $brand;
}

.post-action-num {
  margin-left: 6px;
}

.post-action-icon {
  width: 36px;
  padding: 0;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.post-content {
  margin-top: 4px;
}

.post-tags {
  padding-top: 4px;
}

.comments {
  margin-top: 48px;
  padding-bottom: 96px;
}

.comments-head {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  min-height: 40px;
}

.comments-title {
  color: $text-strong;
  font-size: 18px;
  font-weight: 900;
  line-height: 28px;
}

.comments-count {
  color: $text-muted;
  font-size: 14px;
  font-weight: 700;
}

.reply-login {
  margin-top: 16px;
  padding: 16px;
  border-radius: $radius;
  background: $bg-card;
  color: $text-muted;
  font-size: 14px;
}

.reply-login a {
  margin-left: 8px;
  color: $brand;
  font-weight: 600;
}

.comments-loading {
  margin-top: 8px;
}

.comment-skeleton {
  padding: 20px 0;
  border-bottom: 1px solid $border;
}

.comment-list {
  margin-top: 8px;
}

.comment-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  padding: 20px 0;
}

.comment-avatar {
  display: block;
  margin-right: 12px;
  flex-shrink: 0;
}

.comment-main {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-width: 0;
}

.comment-head {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.comment-head-left {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-width: 0;
}

.comment-author {
  color: $text-strong;
  font-size: 14px;
  font-weight: 600;
}

.comment-author:hover {
  color: $brand;
}

.comment-meta {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: $text-dim;
  font-size: 12px;
  white-space: nowrap;
}

.comment-floor {
  margin-right: 10px;
}

.comment-content {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.7;
}

.comment-content p {
  margin-bottom: 8px;
}

.comment-content img.markdown-emoji {
  width: 40px;
  height: 40px;
}

.comment-actions {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 6px;
}

.comment-action {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 26px;
  padding: 0 8px;
  margin-right: 4px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: $text-dim;
  font-size: 12px;
  cursor: pointer;
}

.comment-action:hover {
  background: $bg-hover;
  color: $brand;
}

.comment-action span {
  margin-left: 4px;
}

.comments-empty {
  margin-top: 16px;
}

.state-action {
  margin-top: 14px;
}

.load-more-comments {
  min-width: 200px;
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

.theme-dark .post-page::before {
  opacity: 0.25;
}

.theme-dark .post-page::after {
  background: -webkit-linear-gradient(top, rgba(23, 23, 23, 0) 6%, rgba(23, 23, 23, 0.55) 30%, rgba(23, 23, 23, 0.85) 55%, #171717 78%);
  background: linear-gradient(to bottom, rgba(23, 23, 23, 0) 6%, rgba(23, 23, 23, 0.55) 30%, rgba(23, 23, 23, 0.85) 55%, #171717 78%);
}

.theme-dark .post-title,
.theme-dark .post-author-name-row,
.theme-dark .comments-title,
.theme-dark .comment-author {
  color: #fff;
}

.theme-dark .post-action:hover,
.theme-dark .back-btn:hover {
  background: $dark-card;
  color: #fff;
}

.theme-dark .post-author-bar {
  border-bottom-color: $dark-border;
}

.theme-dark .reply-login {
  background: $dark-card;
  color: $dark-muted;
}

.theme-dark .comment-skeleton {
  border-bottom-color: $dark-border;
}

.theme-dark .comment-action:hover {
  background: $dark-card;
}

@media (max-width: 1023px) {
  .post-hero-inner {
    padding: 16px 20px 0;
  }

  .post-title {
    font-size: 40px;
  }

  .post-body {
    padding-top: 16px;
  }
}

@media (max-width: 767px) {
  .post-page::before,
  .post-page::after {
    height: 420px;
  }

  .post-hero-inner {
    padding: 14px 14px 0;
  }

  .post-title {
    font-size: 28px;
    line-height: 1.2;
    letter-spacing: -0.2px;
  }

  .post-status {
    font-size: 12px;
  }

  .post-author-bar {
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }

  .post-actions {
    margin-top: 8px;
  }

  .comments {
    padding-bottom: 60px;
  }

  .comment-meta {
    font-size: 11px;
  }
}
</style>
