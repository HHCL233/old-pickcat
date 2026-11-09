<template>
  <main class="auth-main">
    <div class="auth-deco"></div>
    <div class="auth-inner">
      <div class="auth-heading desktop-only">
        <h1>一起分享创意，<br>让每个作品被看见。</h1>
      </div>

      <div class="auth-card">
        <h2 class="auth-title">登录</h2>
        <p class="auth-sub">欢迎回来，继续你的创作之旅。</p>

        <form novalidate @submit.prevent="submit">
          <div class="field">
            <label class="label" for="login-account">邮箱 / 手机号</label>
            <input
              id="login-account"
              v-model="account"
              class="input"
              type="text"
              autocomplete="username"
              maxlength="254"
              placeholder="已验证的邮箱或中国大陆手机号"
            >
          </div>

          <div class="field">
            <label class="label" for="login-password">
              密码
              <a class="label-link" href="javascript:void(0)" @click="notice = '找回密码功能在还原版本中暂未开放'">忘记密码？</a>
            </label>
            <input
              id="login-password"
              v-model="password"
              class="input"
              type="password"
              autocomplete="current-password"
              placeholder="输入密码"
            >
          </div>

          <div v-if="notice" class="error-box auth-notice">{{ notice }}</div>

          <button type="submit" class="btn btn-primary btn-block auth-submit" :disabled="submitting">
            {{ submitting ? '正在登录…' : '登录' }}
          </button>
        </form>

        <p class="auth-alt">
          没有账号？
          <router-link to="/register">注册</router-link>
        </p>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'LoginView',
  data: function () {
    return {
      account: '',
      password: '',
      notice: '',
      submitting: false
    }
  },
  methods: {
    submit: function () {
      if (!this.account.trim()) {
        this.notice = '请输入邮箱或手机号'
        return
      }
      if (!this.password) {
        this.notice = '请输入密码'
        return
      }
      this.notice = '登录需要原站的人机验证，静态还原版本暂未接入，请前往原站登录。'
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
  -ms-flex: 0 1 400px;
  flex: 0 1 400px;
  width: 400px;
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

.label-link {
  float: right;
  color: $brand;
  font-size: 12px;
  font-weight: 600;
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
