<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-content">
      <router-view />
    </main>
    <AppFooter />
    <MobileNav />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import MobileNav from './components/MobileNav.vue'

export default {
  name: 'App',
  components: { AppHeader, AppFooter, MobileNav }
}
</script>
