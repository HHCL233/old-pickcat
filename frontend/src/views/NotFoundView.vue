<template>
  <main class="container">
    <div class="notfound">
      <p class="notfound-code">404</p>
      <h1 class="notfound-title">页面走丢了</h1>
      <p class="notfound-desc">你访问的页面不存在，或者已经被移动。</p>
      <router-link to="/" class="btn btn-primary">返回首页</router-link>
    </div>
  </main>
</template>

<script>
export default {
  name: 'NotFoundView',
  created: function () {
    document.title = '页面不存在 - PICKCAT'
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.notfound {
  padding: 80px 16px;
  text-align: center;
}

.notfound-code {
  color: $brand;
  font-size: 72px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -2px;
}

.notfound-title {
  margin-top: 16px;
  color: $text-strong;
  font-size: 26px;
  font-weight: 700;
}

.notfound-desc {
  margin-top: 8px;
  margin-bottom: 24px;
  color: $text-muted;
  font-size: 14px;
}

.theme-dark .notfound-title {
  color: #fff;
}
</style>
