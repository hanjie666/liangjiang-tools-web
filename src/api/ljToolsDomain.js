import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ljToolsDomain',
    method: 'post',
    data
  })
}

export function get() {
  return request({
    url: 'api/ljToolsDomain',
    method: 'get'
  })
}

export function del(ids) {
  return request({
    url: 'api/ljToolsDomain/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ljToolsDomain',
    method: 'put',
    data
  })
}

export default {add, edit, del, get}
