import { supportsWebp } from '../utils/webp'
import { getUser } from '../api'

var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
var mentionCache = {}
var mentionPending = {}

function replaceImage (img, label, inline) {
  var span = document.createElement('span')
  span.className = inline ? 'emoji-fallback' : 'emoji-fallback image-fallback'
  span.appendChild(document.createTextNode(label))
  if (img.parentNode) {
    img.parentNode.replaceChild(span, img)
  }
}

function renderMention (span, id, username) {
  while (span.firstChild) {
    span.removeChild(span.firstChild)
  }

  if (username) {
    var link = document.createElement('a')
    link.className = 'mention-link'
    link.href = '/profile/' + id
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.setAttribute('aria-label', '查看 ' + username + ' 的个人主页')
    link.appendChild(document.createTextNode('@' + username))
    span.appendChild(link)
  } else {
    span.appendChild(document.createTextNode('@用户'))
  }

  span.setAttribute('data-mention-ready', '1')
}

/**
 * 把服务端返回的 <span class="markdown-user-mention" data-user-id="uuid">@{uuid}</span>
 * 还原成原站那样的 “@用户名” 个人主页链接。
 */
function hydrateMentions (root) {
  if (!root || !root.querySelectorAll) return

  var spans = root.querySelectorAll('span.markdown-user-mention')
  for (var i = 0; i < spans.length; i++) {
    var span = spans[i]
    if (span.getAttribute('data-mention-ready') === '1') continue

    var id = (span.getAttribute('data-user-id') || '').toLowerCase()
    if (!UUID_RE.test(id)) {
      var match = /@\{([0-9a-f-]{36})\}/i.exec(span.textContent || '')
      if (!match) continue
      id = match[1].toLowerCase()
    }

    if (Object.prototype.hasOwnProperty.call(mentionCache, id)) {
      renderMention(span, id, mentionCache[id])
      continue
    }

    if (mentionPending[id]) continue
    mentionPending[id] = true

    ;(function (userId) {
      getUser(userId)
        .then(function (user) {
          mentionCache[userId] = user && user.username ? user.username : null
        })
        .catch(function () {
          mentionCache[userId] = null
        })
        .then(function () {
          delete mentionPending[userId]
          hydrateMentions(document)
        })
    })(id)
  }
}

function currentOrigin () {
  return window.location.protocol + '//' + window.location.host
}

/**
 * 正文中指向原站的链接改为当前启动地址，避免点击后跳回原站。
 */
function localizeLinks (el) {
  var origin = currentOrigin()
  var links = el.querySelectorAll('a[href]')

  for (var i = 0; i < links.length; i++) {
    var link = links[i]
    var href = link.getAttribute('href') || ''
    var match = /^(?:https?:)?\/\/pickcat\.dao3\.fun(?::\d+)?([\/?#].*)?$/i.exec(href)
    if (!match) continue

    link.setAttribute('href', origin + (match[1] || '/'))
    link.removeAttribute('target')

    var text = link.textContent || ''
    if (text.indexOf('pickcat.dao3.fun') >= 0) {
      link.textContent = text.replace(/(?:https?:)?\/\/pickcat\.dao3\.fun(?::\d+)?/ig, origin)
    }
  }
}

function enhance (el) {
  if (!el) return

  localizeLinks(el)

  // IE11 不支持 WebP，把表情和正文图片换成文字占位，避免出现破图
  if (!supportsWebp()) {
    var emojis = el.querySelectorAll('img.markdown-emoji')
    for (var i = 0; i < emojis.length; i++) {
      replaceImage(emojis[i], '[表情]', true)
    }
    var contentImages = el.querySelectorAll('img')
    for (var n = 0; n < contentImages.length; n++) {
      replaceImage(contentImages[n], '[图片]', false)
    }
  } else {
    var imagesWithFallback = el.querySelectorAll('img:not(.markdown-emoji)')
    for (var k = 0; k < imagesWithFallback.length; k++) {
      imagesWithFallback[k].onerror = function () {
        replaceImage(this, '[图片加载失败]', false)
      }
    }
  }

  var origin = currentOrigin()
  var links = el.querySelectorAll('a')
  for (var j = 0; j < links.length; j++) {
    links[j].setAttribute('rel', 'noopener noreferrer')
    var href = links[j].getAttribute('href') || ''
    if (href.indexOf('http') === 0) {
      if (href === origin || href.indexOf(origin + '/') === 0) {
        links[j].removeAttribute('target')
      } else {
        links[j].setAttribute('target', '_blank')
      }
    }
  }

  hydrateMentions(el)
}

function render (el, binding) {
  var html = binding.value || ''
  if (html === el.__richHtml) {
    enhance(el)
    return
  }
  el.__richHtml = html
  el.innerHTML = html
  enhance(el)
}

export default {
  bind: render,
  inserted: function (el) {
    enhance(el)
  },
  update: render,
  componentUpdated: function (el, binding) {
    enhance(el)
  }
}
