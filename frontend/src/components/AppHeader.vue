<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="logo" aria-label="PICKCAT 首页">
        <img class="logo-light" src="/images/brand/pickcat-logo-light.png" alt="PICKCAT">
        <img class="logo-dark" src="/images/brand/pickcat-logo-dark.png" alt="PICKCAT">
      </router-link>

      <nav v-if="!isAuthPage" class="header-nav desktop-only" aria-label="内容导航">
        <router-link to="/" class="nav-link" :class="{ active: isForum }">论坛</router-link>
        <router-link to="/works" class="nav-link" :class="{ active: isWorks }">作品</router-link>
      </nav>

      <div class="header-actions">
        <form v-if="!isAuthPage" class="search-form desktop-only" role="search" @submit.prevent="submitSearch">
          <span class="search-icon">
            <AppIcon name="search" :size="16" />
          </span>
          <input
            v-model="keyword"
            class="search-input"
            type="text"
            maxlength="80"
            placeholder="搜索帖子、用户和作品"
            aria-label="搜索帖子、用户和作品"
          >
        </form>

        <button
          v-if="!isAuthPage"
          type="button"
          class="icon-btn search-mobile-btn"
          aria-label="搜索"
          @click="goSearchPage"
        >
          <AppIcon name="search" :size="19" />
        </button>

        <div class="theme-wrap">
          <button
            type="button"
            class="icon-btn"
            aria-label="选择主题"
            @click.stop="toggleThemeMenu"
          >
            <AppIcon :name="themeIcon" :size="19" />
          </button>
          <div v-if="themeMenuOpen" class="theme-menu">
            <button
              v-for="option in themeOptions"
              :key="option.value"
              type="button"
              class="theme-option"
              :class="{ active: themeState.preference === option.value }"
              @click="chooseTheme(option.value)"
            >{{ option.label }}</button>
          </div>
        </div>

        <template v-if="!isAuthPage && user">
          <router-link :to="'/profile/' + user.id" class="header-user">
            <UserAvatar :user="user" :size="28" />
            <span class="desktop-only">{{ user.username }}</span>
          </router-link>
        </template>
        <template v-else-if="!isAuthPage">
          <router-link to="/login" class="auth-link hide-mobile">登录</router-link>
          <router-link to="/register" class="btn-register hide-mobile">注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import AppIcon from './AppIcon.vue'
import UserAvatar from './UserAvatar.vue'
import { state } from '../store'
import { themeState as themeStore, setTheme } from '../utils/theme'

export default {
  name: 'AppHeader',
  components: { AppIcon, UserAvatar },
  data: function () {
    return {
      keyword: '',
      themeMenuOpen: false,
      themeOptions: [
        { value: 'light', label: '浅色' },
        { value: 'dark', label: '深色' },
        { value: 'system', label: '跟随系统' }
      ]
    }
  },
  computed: {
    user: function () {
      return state.user
    },
    themeState: function () {
      return themeStore
    },
    themeIcon: function () {
      return themeStore.resolved === 'dark' ? 'sun' : 'moon'
    },
    isForum: function () {
      return this.$route.path === '/' || this.$route.path.indexOf('/forum') === 0
    },
    isWorks: function () {
      return this.$route.path.indexOf('/works') === 0
    },
    isAuthPage: function () {
      return this.$route.path === '/login' || this.$route.path === '/register'
    }
  },
  mounted: function () {
    document.addEventListener('click', this.closeThemeMenu)
  },
  beforeDestroy: function () {
    document.removeEventListener('click', this.closeThemeMenu)
  },
  methods: {
    toggleThemeMenu: function () {
      this.themeMenuOpen = !this.themeMenuOpen
    },
    closeThemeMenu: function () {
      this.themeMenuOpen = false
    },
    chooseTheme: function (value) {
      setTheme(value)
      this.themeMenuOpen = false
    },
    submitSearch: function () {
      var query = this.keyword.trim()
      if (!query) return
      this.$router.push({ path: '/search', query: { q: query } }).catch(function () {})
    },
    goSearchPage: function () {
      this.$router.push('/search').catch(function () {})
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.logo-dark {
  display: none;
}

.search-mobile-btn {
  display: none;
}

@media (max-width: 1023px) {
  .search-mobile-btn {
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
  }
}

.theme-dark .logo-light {
  display: none;
}

.theme-dark .logo-dark {
  display: block;
}
</style>
