import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ForumView from '../views/ForumView.vue'
import CategoryView from '../views/CategoryView.vue'
import PostView from '../views/PostView.vue'
import WorksView from '../views/WorksView.vue'
import WorkDetailView from '../views/WorkDetailView.vue'
import SearchView from '../views/SearchView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import EditorView from '../views/EditorView.vue'
import NotFoundView from '../views/NotFoundView.vue'

Vue.use(VueRouter)

var router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'PICKCAT' } },
    { path: '/forum', name: 'forum', component: ForumView, meta: { title: '板块 - PICKCAT' } },
    { path: '/forum/category/:slug', name: 'category', component: CategoryView, props: true },
    { path: '/forum/post/:id', name: 'post', component: PostView, props: true },
    { path: '/forum/editor', name: 'editor', component: EditorView, meta: { title: '发帖 - PICKCAT' } },
    { path: '/works', name: 'works', component: WorksView, meta: { title: '作品 - PICKCAT' } },
    { path: '/works/:id', name: 'work', component: WorkDetailView, props: true },
    { path: '/search', name: 'search', component: SearchView, meta: { title: '搜索 - PICKCAT' } },
    { path: '/profile/:id', name: 'profile', component: ProfileView, props: true },
    { path: '/login', name: 'login', component: LoginView, meta: { title: '登录 - PICKCAT' } },
    { path: '/register', name: 'register', component: RegisterView, meta: { title: '注册 - PICKCAT' } },
    { path: '*', name: 'not-found', component: NotFoundView, meta: { title: '页面不存在 - PICKCAT' } }
  ],
  scrollBehavior: function (to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { selector: to.hash, offset: { x: 0, y: 80 } }
    }
    return { x: 0, y: 0 }
  }
})

router.afterEach(function (to) {
  var title = to.meta && to.meta.title
  if (title) document.title = title
})

export default router
