import Vue from 'vue'

var STORAGE_KEY = 'pickcat-theme'

export var themeState = Vue.observable({
  preference: 'system',
  resolved: 'light'
})

var media = null
var listenerAttached = false

function systemPrefersDark () {
  try {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  } catch (e) {
    return false
  }
}

function resolve (preference) {
  if (preference === 'dark') return 'dark'
  if (preference === 'light') return 'light'
  return systemPrefersDark() ? 'dark' : 'light'
}

function apply (resolved) {
  var root = document.documentElement
  if (resolved === 'dark') {
    if (root.classList) root.classList.add('theme-dark')
    else root.className += ' theme-dark'
  } else {
    if (root.classList) root.classList.remove('theme-dark')
    else root.className = root.className.replace(/\btheme-dark\b/g, '')
  }
  themeState.resolved = resolved
}

export function setTheme (preference) {
  themeState.preference = preference
  try {
    if (preference === 'system') window.localStorage.removeItem(STORAGE_KEY)
    else window.localStorage.setItem(STORAGE_KEY, preference)
  } catch (e) {}
  apply(resolve(preference))
}

export function initTheme () {
  var saved = 'system'
  try {
    saved = window.localStorage.getItem(STORAGE_KEY) || 'system'
  } catch (e) {}
  if (saved !== 'light' && saved !== 'dark' && saved !== 'system') saved = 'system'
  themeState.preference = saved
  apply(resolve(saved))

  if (!listenerAttached && window.matchMedia) {
    try {
      media = window.matchMedia('(prefers-color-scheme: dark)')
      var onChange = function () {
        if (themeState.preference === 'system') apply(resolve('system'))
      }
      if (media.addEventListener) media.addEventListener('change', onChange)
      else if (media.addListener) media.addListener(onChange)
      listenerAttached = true
    } catch (e) {}
  }
}
