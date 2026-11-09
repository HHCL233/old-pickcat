<template>
  <main class="container">
    <div class="editor-back">
      <button type="button" class="back-btn" @click="goBack">
        <AppIcon name="chevron-left" :size="16" />
        <span>返回</span>
      </button>
    </div>

    <div class="card editor-card">
      <h1 class="editor-title">发布新帖</h1>
      <p class="editor-sub">分享你的想法、作品或问题。</p>

      <div class="info-box editor-notice">
        发布帖子需要登录。本站为静态还原版本，未接入原站的人机验证，暂时无法直接发布。
      </div>

      <div class="field">
        <label class="label" for="editor-title">标题</label>
        <input
          id="editor-title"
          v-model="title"
          class="input"
          type="text"
          maxlength="120"
          placeholder="写一个清晰、具体的标题"
        >
      </div>

      <div class="field">
        <label class="label" for="editor-category">板块</label>
        <select id="editor-category" v-model="category" class="select">
          <option value="">请选择板块</option>
          <option v-for="item in categories" :key="item.slug" :value="item.slug">
            {{ item.name }}
          </option>
        </select>
      </div>

      <div class="field">
        <label class="label" for="editor-content">正文</label>
        <textarea
          id="editor-content"
          v-model="content"
          class="textarea editor-textarea"
          placeholder="支持 Markdown 语法，写下你想分享的内容…"
        ></textarea>
      </div>

      <div v-if="notice" class="error-box">{{ notice }}</div>

      <div class="editor-actions">
        <button type="button" class="btn btn-outline" @click="goBack">取消</button>
        <button type="button" class="btn btn-primary" @click="publish">发布</button>
      </div>
    </div>
  </main>
</template>

<script>
import AppIcon from '../components/AppIcon.vue'
import { loadCategories, topCategories } from '../store'

export default {
  name: 'EditorView',
  components: { AppIcon },
  data: function () {
    return {
      title: '',
      category: '',
      content: '',
      notice: ''
    }
  },
  computed: {
    categories: function () {
      return topCategories()
    }
  },
  created: function () {
    loadCategories()
    document.title = '发帖 - PICKCAT'
  },
  methods: {
    goBack: function () {
      if (window.history.length > 1) this.$router.back()
      else this.$router.push('/')
    },
    publish: function () {
      if (!this.title.trim()) {
        this.notice = '请填写标题'
        return
      }
      if (!this.category) {
        this.notice = '请选择板块'
        return
      }
      if (!this.content.trim()) {
        this.notice = '请填写正文'
        return
      }
      this.notice = '请先登录后再发帖。静态还原版本暂未接入原站登录。'
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/variables.scss';

.editor-back {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-height: 40px;
  margin-bottom: 12px;
}

.back-btn {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 36px;
  padding: 0 10px 0 2px;
  border: 0;
  border-radius: $radius-sm;
  background: transparent;
  color: $text-muted;
  font-size: 15px;
  cursor: pointer;
}

.back-btn:hover {
  background: $bg-hover;
  color: $text-strong;
}

.editor-card {
  max-width: 904px;
  padding: 28px;
}

.editor-title {
  color: $text-strong;
  font-size: 26px;
  line-height: 1.3;
  font-weight: 800;
}

.editor-sub {
  margin-top: 4px;
  margin-bottom: 18px;
  color: $text-muted;
  font-size: 13px;
}

.editor-notice {
  margin-bottom: 22px;
}

.editor-textarea {
  min-height: 260px;
}

.editor-actions {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  margin-top: 8px;
}

.editor-actions .btn {
  margin-left: 10px;
}

.theme-dark .editor-title {
  color: #fff;
}

.theme-dark .back-btn {
  color: $dark-muted;
}

.theme-dark .back-btn:hover {
  background: $dark-card;
  color: #fff;
}

@media (max-width: 767px) {
  .editor-card {
    padding: 18px;
  }

  .editor-title {
    font-size: 22px;
  }
}
</style>
