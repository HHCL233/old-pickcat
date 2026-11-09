<template>
  <nav v-if="!isAuth" class="mobile-nav" aria-label="主导航">
    <router-link to="/" class="mobile-nav-item" :class="{ active: isHome }">
      <AppIcon name="home" :size="21" />
      <span>首页</span>
    </router-link>
    <router-link to="/forum" class="mobile-nav-item" :class="{ active: isForum }">
      <AppIcon name="grid" :size="21" />
      <span>板块</span>
    </router-link>
    <router-link to="/works" class="mobile-nav-item" :class="{ active: isWorks }">
      <AppIcon name="works" :size="21" />
      <span>作品</span>
    </router-link>
    <router-link :to="profileTarget" class="mobile-nav-item" :class="{ active: isProfile }">
      <AppIcon name="user" :size="21" />
      <span>我的</span>
    </router-link>
  </nav>
</template>

<script>
import AppIcon from './AppIcon.vue'
import { state } from '../store'

export default {
  name: 'MobileNav',
  components: { AppIcon },
  computed: {
    path: function () {
      return this.$route.path
    },
    isHome: function () {
      return this.path === '/'
    },
    isForum: function () {
      return this.path.indexOf('/forum') === 0
    },
    isWorks: function () {
      return this.path.indexOf('/works') === 0
    },
    isProfile: function () {
      return this.path.indexOf('/profile') === 0 || this.path === '/login'
    },
    isAuth: function () {
      return this.path === '/login' || this.path === '/register'
    },
    profileTarget: function () {
      return state.user ? '/profile/' + state.user.id : '/login'
    }
  }
}
</script>
