import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ljToolsCloudMusic/upload',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ljToolsCloudMusic/upload',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ljToolsCloudMusic/upload',
    method: 'put',
    data
  })
}
export function batchCreate(data) {
  return request({
    url: 'api/ljToolsCloudMusic/upload/batch',
    method: 'post',
    data
  })
}

export function importCookie(data) {
  return request({
    url: 'api/ljToolsCloudMusic/upload/import',
    method: 'post',
    data
  })
}

export default { add, edit, del, batchCreate, importCookie }
