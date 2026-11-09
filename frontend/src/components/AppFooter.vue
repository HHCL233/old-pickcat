<template>
  <footer class="app-footer" role="contentinfo">
    <nav class="footer-links" aria-label="法律协议">
      <a href="https://dao3.fun/docs/userAgreement" target="_blank" rel="noopener noreferrer">神奇代码岛用户服务协议</a>
      <a href="https://dao3.fun/docs/privacyPolicy" target="_blank" rel="noopener noreferrer">神奇代码岛个人信息保护政策</a>
    </nav>
    <div class="footer-meta">
      <a href="https://beian.mps.gov.cn/#/query/webSearch?code=44030602003657" target="_blank" rel="noopener noreferrer">
        <img src="/images/legal/public-security-registration.png" alt="">
        <span>粤公网安备 44030602003657号</span>
      </a>
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">粤ICP备2022075904号</a>
    </div>
    <p class="footer-copy">版权所有 © 2026 深圳奇梦岛科技有限公司</p>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.footer-copy {
  margin-top: 2px;
  font-size: 14px;
  line-height: 24px;
}
</style>
