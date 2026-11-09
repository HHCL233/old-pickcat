<template>
  <main class="auth-main">
    <div class="auth-deco"></div>
    <div class="auth-inner">
      <div class="auth-heading desktop-only">
        <h1>加入 PICKCAT，<br>把灵感变成作品。</h1>
      </div>

      <div class="auth-card">
        <h2 class="auth-title">注册</h2>
        <p class="auth-sub">创建账号，开始分享你的创意。</p>

        <form novalidate @submit.prevent="submit">
          <div class="field">
            <label class="label" for="reg-account">邮箱 / 手机号</label>
            <input
              id="reg-account"
              v-model="account"
              class="input"
              type="text"
              maxlength="254"
              placeholder="邮箱或中国大陆手机号"
            >
          </div>

          <div class="field">
            <label class="label" for="reg-name">用户名</label>
            <input
              id="reg-name"
              v-model="username"
              class="input"
              type="text"
              maxlength="32"
              placeholder="给自己起一个名字"
            >
          </div>

          <div class="field">
            <label class="label" for="reg-password">密码</label>
            <input
              id="reg-password"
              v-model="password"
              class="input"
              type="password"
              autocomplete="new-password"
              placeholder="设置密码"
            >
          </div>

          <div class="field">
            <label class="label" for="reg-confirm">确认密码</label>
            <input
              id="reg-confirm"
              v-model="confirmPassword"
              class="input"
              type="password"
              autocomplete="new-password"
              placeholder="再次输入密码"
            >
          </div>

          <div v-if="notice" class="error-box auth-notice">{{ notice }}</div>

          <button type="submit" class="btn btn-primary btn-block auth-submit">注册</button>
        </form>

        <p class="auth-alt">
          已有账号？
          <router-link to="/login">登录</router-link>
        </p>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'RegisterView',
  data: function () {
    return {
      account: '',
      username: '',
      password: '',
      confirmPassword: '',
      notice: ''
    }
  },
  methods: {
    submit: function () {
      if (!this.account.trim()) {
        this.notice = '请输入邮箱或手机号'
        return
      }
      if (!this.username.trim()) {
        this.notice = '请输入用户名'
        return
      }
      if (!this.password) {
        this.notice = '请输入密码'
        return
      }
      if (this.password !== this.confirmPassword) {
        this.notice = '两次输入的密码不一致'
        return
      }
      this.notice = '注册需要原站的人机验证，静态还原版本暂未接入，请前往原站注册。'
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.auth-main {
  position: relative;
  min-height: 0;
  overflow: hidden;
}

.auth-deco {
  position: absolute;
  right: 4%;
  bottom: -100px;
  width: 420px;
  height: 585px;
  background: url('/images/pages/home-decoration.png') center bottom no-repeat;
  background-size: contain;
  opacity: 0.9;
  pointer-events: none;
}

.auth-inner {
  position: relative;
  z-index: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  width: 100%;
  max-width: 1280px;
  min-height: calc(100vh - 200px);
  margin: 0 auto;
  padding: 40px 32px 72px;
}

.auth-heading {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  max-width: 576px;
}

.auth-heading h1 {
  color: $text-strong;
  font-size: 36px;
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.auth-card {
  -webkit-box-flex: 0;
  -ms-flex: 0 1 420px;
  flex: 0 1 420px;
  width: 420px;
  max-width: 100%;
  padding: 28px;
  border-radius: $radius;
  background: $bg-card;
}

.auth-title {
  color: $text-strong;
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
}

.auth-sub {
  margin-top: 4px;
  margin-bottom: 22px;
  color: $text-muted;
  font-size: 13px;
}

.auth-notice {
  margin-bottom: 16px;
}

.auth-submit {
  margin-top: 4px;
  height: 44px;
}

.auth-alt {
  margin-top: 18px;
  color: $text-muted;
  font-size: 13px;
  text-align: center;
}

.auth-alt a {
  color: $brand;
  font-weight: 600;
}

.theme-dark .auth-heading h1,
.theme-dark .auth-title {
  color: #fff;
}

.theme-dark .auth-card {
  background: $dark-card;
}

.theme-dark .auth-sub,
.theme-dark .auth-alt {
  color: $dark-muted;
}

@media (max-width: 1023px) {
  .auth-inner {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    padding: 32px 20px 72px;
  }

  .auth-deco {
    right: -80px;
    opacity: 0.35;
  }
}

@media (max-width: 767px) {
  .auth-main {
    min-height: 0;
  }

  .auth-inner {
    min-height: calc(100vh - 240px);
    padding: 24px 12px 72px;
  }

  .auth-card {
    padding: 20px;
  }

  .auth-deco {
    display: none;
  }
}
</style>
