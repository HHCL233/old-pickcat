<template>
  <span class="avatar" :style="boxStyle">
    <img v-if="url && !failed" :src="url" :alt="name || ''" @error="failed = true">
    <span v-else class="avatar-fallback" :style="textStyle">{{ letter }}</span>
  </span>
</template>

<script>
import { avatarUrl, initialOf } from '../utils/format'

export default {
  name: 'UserAvatar',
  props: {
    user: { type: Object, default: null },
    src: { type: String, default: '' },
    name: { type: String, default: '' },
    size: { type: Number, default: 20 }
  },
  data: function () {
    return { failed: false }
  },
  computed: {
    url: function () {
      if (this.src) return this.src
      if (this.user && typeof this.user.avatar === 'string') return this.user.avatar
      return avatarUrl(this.user)
    },
    displayName: function () {
      if (this.name) return this.name
      if (!this.user) return ''
      return this.user.username || this.user.name || ''
    },
    letter: function () {
      return initialOf(this.displayName)
    },
    boxStyle: function () {
      return { width: this.size + 'px', height: this.size + 'px' }
    },
    textStyle: function () {
      return { fontSize: Math.max(9, Math.round(this.size * 0.4)) + 'px' }
    }
  },
  watch: {
    src: function () {
      this.failed = false
    },
    user: function () {
      this.failed = false
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.avatar {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  background: #f0f0f0;
  color: $text;
  font-weight: 700;
  flex-shrink: 0;
}

.avatar img {
  display: block;
  width: 100%;
  height: 100%;
}

.avatar-fallback {
  display: block;
  line-height: 1;
}

.theme-dark .avatar {
  background: #333;
  color: #e5e5e5;
}
</style>
