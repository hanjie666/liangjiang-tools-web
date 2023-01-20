import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ljToolsArticle',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ljToolsArticle/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ljToolsArticle',
    method: 'put',
    data
  })
}

export function get(data) {
  return request({
    url: 'api/ljToolsArticle/' + data,
    method: 'get'
  })
}

export default { get, add, edit, del }
