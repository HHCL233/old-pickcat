import axios from 'axios'

var http = axios.create({
  baseURL: '/api/v1',
  timeout: 20000,
  withCredentials: true
})

function serialize (params) {
  if (!params) return ''
  var parts = []
  Object.keys(params).forEach(function (key) {
    var value = params[key]
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      value.forEach(function (item) {
        if (item === undefined || item === null || item === '') return
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(item))
      })
    } else {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
  })
  return parts.join('&')
}

http.defaults.paramsSerializer = serialize

function normalizeError (error) {
  var response = error && error.response
  var data = response && response.data
  var message = '网络请求失败，请稍后重试'
  if (data && typeof data === 'object') {
    message = data.message || data.error || message
  } else if (error && error.message) {
    message = error.message
  }
  var err = new Error(message)
  err.status = response ? response.status : 0
  err.code = data && data.code
  err.data = data
  return err
}

http.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    return Promise.reject(normalizeError(error))
  }
)

function get (url, params) {
  return http.get(url, { params: params })
}

function post (url, body, config) {
  return http.post(url, body, config)
}

export function getSession () {
  return get('/session')
}

export function getTags () {
  return get('/tags')
}

export function getTopicFeed (params) {
  return get('/topic-recommendations', params)
}

export function getTopics (params) {
  return get('/topics', params)
}

export function getTopic (id) {
  return get('/topics/' + encodeURIComponent(id))
}

export function getTopicPosts (id, params) {
  return get('/topics/' + encodeURIComponent(id) + '/posts', params)
}

export function getTopicRecommendations (params) {
  return get('/topic-recommendations', params)
}

export function getWorkFeed (params) {
  return get('/work-recommendations', params)
}

export function getFeaturedWorks () {
  return get('/featured-works')
}

export function getWork (id) {
  return get('/works/' + encodeURIComponent(id))
}

export function getWorkStats (id) {
  return get('/works/' + encodeURIComponent(id) + '/stats')
}

export function getUser (id) {
  return get('/users/' + encodeURIComponent(id))
}

export function getUserTopics (id, params) {
  return get('/users/' + encodeURIComponent(id) + '/topics', params)
}

export function getUserWorks (id, params) {
  return get('/users/' + encodeURIComponent(id) + '/works', params)
}

export function searchTopics (query, params) {
  return get('/topics', Object.assign({ q: query }, params || {}))
}

export function searchWorks (query, params) {
  return get('/search/works', Object.assign({ q: query }, params || {}))
}

export function searchUsers (query, params) {
  return get('/search/users', Object.assign({ q: query }, params || {}))
}

export function login (payload) {
  return post('/login', payload)
}

export default http
