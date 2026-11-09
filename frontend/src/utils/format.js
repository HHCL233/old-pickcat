export function relativeTime (value) {
  if (!value) return ''
  var time = new Date(value).getTime()
  if (isNaN(time)) return ''
  var diff = Date.now() - time
  if (diff < 0) diff = 0
  var minute = 60 * 1000
  var hour = 60 * minute
  var day = 24 * hour
  if (diff < minute) return '刚刚'
  if (diff < hour) return Math.floor(diff / minute) + '分钟前'
  if (diff < day) return Math.floor(diff / hour) + '小时前'
  if (diff < 30 * day) return Math.floor(diff / day) + '天前'
  var date = new Date(time)
  return date.getFullYear() + '/' + pad(date.getMonth() + 1) + '/' + pad(date.getDate())
}

export function formatDate (value) {
  if (!value) return ''
  var date = new Date(value)
  if (isNaN(date.getTime())) return ''
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
}

export function pad (num) {
  return num < 10 ? '0' + num : String(num)
}

export function formatCount (value) {
  var num = Number(value)
  if (!num || num < 0) return '0'
  if (num >= 10000) {
    var wan = num / 10000
    return (wan >= 10 ? Math.round(wan) : wan.toFixed(1).replace(/\.0$/, '')) + '万'
  }
  return String(num)
}

export function cleanExcerpt (text) {
  if (!text) return ''
  return String(text)
    .replace(/\[emoji:[^\]]+\]/g, '')
    .replace(/@\{[^}]+\}/g, '@用户')
    .replace(/\s+/g, ' ')
    .trim()
}

export function avatarUrl (entity) {
  if (!entity) return ''
  var avatar = entity.avatar || entity
  if (avatar && avatar.url) return avatar.url
  if (avatar && avatar.id) return '/api/v1/avatars/' + encodeURIComponent(avatar.id)
  return ''
}

export function initialOf (name) {
  if (!name) return '?'
  return String(name).slice(0, 1).toUpperCase()
}

export function topicPath (id) {
  return '/forum/post/' + id
}

export function workPath (id) {
  return '/works/' + id
}

export function profilePath (id) {
  return '/profile/' + id
}

export function normalizeWork (work) {
  if (!work) return null
  return {
    id: work.id,
    title: work.workName || work.title || '未命名作品',
    description: cleanExcerpt(work.description || work.operation || ''),
    cover: work.screenshotCoverUrl || work.preview || work.coverUrl || '',
    preview: work.preview || '',
    author: work.author
      ? {
          id: work.author.id,
          name: work.author.username,
          avatar: avatarUrl(work.author)
        }
      : null,
    viewCount: work.viewCount || 0,
    likeCount: work.likeCount || 0,
    commentCount: work.commentCount || 0,
    type: work.type || '',
    editorName: editorName(work.type)
  }
}

export function editorName (type) {
  var map = {
    KITTEN4: 'KittenN',
    KITTEN3: 'KittenN',
    NEKO: 'KittenN',
    COCO: 'CoCo',
    GANDI: 'Gandi',
    WOOD: '海龟编辑器',
    PYTHON: 'Python'
  }
  return map[type] || type || ''
}
