<template>
  <article class="topic-card" @click="openTopic">
    <div class="topic-head">
      <AppIcon v-if="topic.pinned" name="pin" :size="15" class="pin-icon" />
      <h2 class="topic-title">
        <router-link :to="path" @click.stop>{{ topic.title }}</router-link>
      </h2>
    </div>

    <div v-if="tags.length" class="topic-tags">
      <router-link
        v-for="tag in tags"
        :key="tag.id || tag.slug"
        class="tag"
        :to="'/forum/category/' + tag.slug"
        @click.stop
      >#{{ tag.name }}</router-link>
    </div>

    <p class="topic-excerpt">{{ excerpt }}</p>

    <div class="topic-foot">
      <div class="topic-author">
        <router-link
          v-if="topic.author"
          :to="'/profile/' + topic.author.id"
          class="author-link"
          @click.stop
        >
          <UserAvatar :user="topic.author" :size="20" />
          <span class="author-name">{{ topic.author.username }}</span>
        </router-link>
        <span class="topic-time">{{ time }}</span>
      </div>
      <ul class="topic-stats">
        <li title="回复">
          <AppIcon name="comment" :size="15" />
          <span>{{ replyCount }}</span>
        </li>
        <li title="浏览">
          <AppIcon name="eye" :size="15" />
          <span>{{ viewCount }}</span>
        </li>
      </ul>
    </div>
  </article>
</template>

<script>
import AppIcon from './AppIcon.vue'
import UserAvatar from './UserAvatar.vue'
import { cleanExcerpt, relativeTime, formatCount } from '../utils/format'

export default {
  name: 'TopicCard',
  components: { AppIcon, UserAvatar },
  props: {
    topic: { type: Object, required: true }
  },
  computed: {
    path: function () {
      return '/forum/post/' + this.topic.id
    },
    tags: function () {
      return this.topic.tags || []
    },
    excerpt: function () {
      return cleanExcerpt(this.topic.excerpt)
    },
    time: function () {
      return relativeTime(this.topic.lastActivityAt || this.topic.createdAt)
    },
    replyCount: function () {
      return formatCount(this.topic.replyCount)
    },
    viewCount: function () {
      return formatCount(this.topic.viewCount)
    }
  },
  methods: {
    openTopic: function (event) {
      if (event.target && event.target.tagName === 'A') return
      this.$router.push(this.path).catch(function () {})
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.topic-card {
  position: relative;
  padding: 20px;
  margin-bottom: 12px;
  border-radius: $radius;
  background: $bg-card;
  cursor: pointer;
  transition: background-color 0.15s;
}

.topic-card:hover {
  background: $bg-soft;
}

.topic-head {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
}

.pin-icon {
  margin: 5px 8px 0 0;
  color: $brand;
}

.topic-title {
  min-width: 0;
  color: $text-strong;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.4;
}

.topic-title a {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.topic-tags {
  margin-top: 4px;
  overflow: hidden;
  white-space: nowrap;
}

.topic-excerpt {
  margin-top: 2px;
  color: $text-soft;
  font-size: 14px;
  line-height: 1.55;
  max-height: 43px;
  overflow: hidden;
}

.topic-foot {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 12px;
  color: $text-dim;
  font-size: 12px;
}

.topic-author {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-width: 0;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
}

.author-link {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-width: 0;
  margin-right: 8px;
  color: $text-soft;
  font-weight: 600;
}

.author-link:hover {
  color: $brand;
}

.author-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 180px;
  margin-left: 6px;
}

.topic-time {
  white-space: nowrap;
}

.topic-stats {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-left: 12px;
  list-style: none;
}

.topic-stats li {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-left: 14px;
  white-space: nowrap;
}

.topic-stats li span {
  margin-left: 4px;
}

.theme-dark .topic-card {
  background: $dark-card;
}

.theme-dark .topic-card:hover {
  background: #2e2e2e;
}

.theme-dark .topic-title {
  color: #fff;
}

.theme-dark .topic-excerpt {
  color: $dark-muted;
}

.theme-dark .author-link {
  color: $dark-muted;
}

.theme-dark .author-link:hover {
  color: $brand;
}

@media (max-width: 767px) {
  .topic-card {
    padding: 16px;
  }

  .topic-title {
    font-size: 16px;
  }

  .topic-excerpt {
    font-size: 13px;
    max-height: 20px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .author-name {
    max-width: 110px;
  }
}
</style>
