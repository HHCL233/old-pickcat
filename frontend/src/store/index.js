import Vue from 'vue'
import { getSession, getTags } from '../api'

export var state = Vue.observable({
  user: null,
  sessionStatus: 'unknown',
  categories: [],
  categoriesLoaded: false,
  categoriesLoading: false
})

export function loadSession () {
  if (state.sessionStatus === 'loading' || state.sessionStatus === 'ready') {
    return Promise.resolve(state.user)
  }
  state.sessionStatus = 'loading'
  return getSession()
    .then(function (data) {
      state.user = data && data.user ? data.user : null
      state.sessionStatus = 'ready'
      return state.user
    })
    .catch(function () {
      state.user = null
      state.sessionStatus = 'ready'
      return null
    })
}

export function isLoggedIn () {
  return !!state.user
}

export function loadCategories () {
  if (state.categoriesLoaded || state.categoriesLoading) {
    return Promise.resolve(state.categories)
  }
  state.categoriesLoading = true
  return getTags()
    .then(function (data) {
      state.categories = (data && data.items) || []
      state.categoriesLoaded = true
      state.categoriesLoading = false
      return state.categories
    })
    .catch(function () {
      state.categoriesLoading = false
      return []
    })
}

export var TOP_LEVEL_SLUGS = [
  'creative-works',
  'learning-technology',
  'q-and-a',
  'events-competitions',
  'interest-plaza'
]

export function topCategories () {
  var result = []
  TOP_LEVEL_SLUGS.forEach(function (slug) {
    for (var i = 0; i < state.categories.length; i++) {
      if (state.categories[i].slug === slug) {
        result.push(state.categories[i])
        return
      }
    }
  })
  return result
}
