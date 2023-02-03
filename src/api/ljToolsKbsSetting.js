import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ljToolsKbsSetting',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ljToolsKbsSetting/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ljToolsKbsSetting',
    method: 'put',
    data
  })
}

export function get() {
  return request({
    url: 'api/ljToolsKbsSetting',
    method: 'get'
  })
}

export function getHelpUser(data) {
  return request({
    url: 'api/ljToolsKbsSetting/helpUser?phone=' + data,
    method: 'get'
  })
}

export default { add, edit, del, get }
