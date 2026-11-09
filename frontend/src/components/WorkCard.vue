<template>
  <router-link
    v-if="variant === 'banner'"
    class="work-banner"
    :to="'/works/' + work.id"
  >
    <span class="work-banner-cover" :style="coverStyle">
      <span v-if="!showCover" class="work-cover-fallback">{{ letter }}</span>
    </span>
    <span class="work-banner-shade"></span>
    <span class="work-banner-body">
      <strong class="work-banner-title">{{ work.title }}</strong>
      <span class="work-banner-desc">{{ work.description }}</span>
      <span v-if="work.author" class="work-banner-author">
        <UserAvatar :user="work.author" :size="18" />
        <span>{{ work.author.name }}</span>
      </span>
    </span>
  </router-link>

  <router-link
    v-else-if="variant === 'compact'"
    class="work-compact"
    :to="'/works/' + work.id"
  >
    <span class="work-compact-cover" :style="coverStyle">
      <span v-if="!showCover" class="work-cover-fallback">{{ letter }}</span>
    </span>
    <span class="work-compact-body">
      <strong class="work-compact-title">{{ work.title }}</strong>
      <span class="work-compact-desc">{{ work.description }}</span>
      <span class="work-compact-foot">
        <span v-if="work.author" class="work-compact-author">
          <UserAvatar :user="work.author" :size="16" />
          <span>{{ work.author.name }}</span>
        </span>
        <span class="work-compact-stats">
          <span class="work-stat">
            <AppIcon name="eye" :size="14" />
            <span>{{ views }}</span>
          </span>
          <span class="work-stat">
            <AppIcon name="heart" :size="14" />
            <span>{{ likes }}</span>
          </span>
        </span>
      </span>
    </span>
  </router-link>

  <router-link
    v-else
    class="work-card"
    :to="'/works/' + work.id"
  >
    <span class="work-cover" :style="coverStyle">
      <span v-if="!showCover" class="work-cover-fallback">{{ letter }}</span>
    </span>
    <span class="work-body">
      <strong class="work-title">{{ work.title }}</strong>
      <span v-if="work.author" class="work-author">
        <UserAvatar :user="work.author" :size="16" />
        <span class="work-author-name">{{ work.author.name }}</span>
      </span>
      <span class="work-stats">
        <span class="work-stat">
          <AppIcon name="eye" :size="14" />
          <span>{{ views }}</span>
        </span>
        <span class="work-stat">
          <AppIcon name="heart" :size="14" />
          <span>{{ likes }}</span>
        </span>
      </span>
    </span>
  </router-link>
</template>

<script>
import AppIcon from './AppIcon.vue'
import UserAvatar from './UserAvatar.vue'
import { formatCount, initialOf } from '../utils/format'
import { supportsWebp } from '../utils/webp'

export default {
  name: 'WorkCard',
  components: { AppIcon, UserAvatar },
  props: {
    work: { type: Object, required: true },
    variant: { type: String, default: 'grid' }
  },
  computed: {
    showCover: function () {
      if (!this.work.cover) return false
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
      return initialOf(this.work.title)
    },
    views: function () {
      return formatCount(this.work.viewCount)
    },
    likes: function () {
      return formatCount(this.work.likeCount)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.work-card {
  display: block;
  overflow: hidden;
  border-radius: $radius;
  background: $bg-card;
  transition: transform 0.15s, box-shadow 0.15s;
}

.work-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.work-cover {
  position: relative;
  display: block;
  height: 0;
  padding-top: 100%;
  overflow: hidden;
  background-color: #e5e5e5;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.work-banner-cover {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #d4d4d4;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.work-cover-fallback {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  margin: -30px 0 0 -30px;
  line-height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.32);
  color: rgba(255, 255, 255, 0.9);
  font-size: 26px;
  font-weight: 800;
  text-align: center;
}

.work-body {
  display: block;
  padding: 10px 12px 12px;
}

.work-compact {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  min-height: 168px;
  padding: 16px;
  border-radius: $radius;
  background: $bg-card;
  transition: background-color 0.15s;
}

.work-compact:hover {
  background: $bg-soft;
}

.work-compact-cover {
  position: relative;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 100px;
  flex: 0 0 100px;
  width: 100px;
  height: 100px;
  margin-right: 14px;
  border-radius: $radius-sm;
  background-color: #e5e5e5;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.work-compact-cover .work-cover-fallback {
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  line-height: 40px;
  font-size: 18px;
}

.work-compact-body {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-width: 0;
}

.work-compact-title {
  display: block;
  color: $text-strong;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.work-compact-desc {
  display: block;
  margin-top: 4px;
  color: $text-muted;
  font-size: 12px;
  line-height: 1.5;
  max-height: 36px;
  overflow: hidden;
}

.work-compact-foot {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 10px;
  color: $text-dim;
  font-size: 12px;
}

.work-compact-author {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-width: 0;
}

.work-compact-author > span {
  margin-left: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.work-compact-stats {
  margin-left: auto;
  white-space: nowrap;
}

.work-title {
  display: block;
  color: $text-strong;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.work-author {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 6px;
  color: $text-muted;
  font-size: 12px;
}

.work-author-name {
  margin-left: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.work-stats {
  display: block;
  margin-top: 6px;
  color: $text-dim;
  font-size: 12px;
}

.work-stat {
  display: inline-block;
  margin-right: 14px;
}

.work-stat span {
  margin-left: 3px;
}

.work-banner {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: $radius;
  background: #d4d4d4;
  color: #fff;
}

.work-banner-shade {
  position: absolute;
  top: 35%;
  right: 0;
  bottom: 0;
  left: 0;
  background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.72));
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.72));
}

.work-banner-body {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  padding: 14px 16px;
}

.work-banner-title {
  display: block;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.35;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.work-banner-desc {
  display: block;
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.86);
  font-size: 12px;
  line-height: 1.5;
  max-height: 36px;
  overflow: hidden;
}

.work-banner-author {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
}

.work-banner-author span {
  margin-left: 6px;
}

.theme-dark .work-card {
  background: $dark-card;
}

.theme-dark .work-compact {
  background: $dark-card;
}

.theme-dark .work-compact:hover {
  background: #2e2e2e;
}

.theme-dark .work-compact-title {
  color: #fff;
}

.theme-dark .work-compact-desc {
  color: $dark-muted;
}

.theme-dark .work-title {
  color: #fff;
}

.theme-dark .work-author {
  color: $dark-muted;
}

@media (max-width: 767px) {
  .work-body {
    padding: 8px 10px 10px;
  }

  .work-title {
    font-size: 13px;
  }
}
</style>
