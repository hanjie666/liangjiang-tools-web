import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ljToolsCloudMusic',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ljToolsCloudMusic/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ljToolsCloudMusic',
    method: 'put',
    data
  })
}
export function batchCreate(data) {
  return request({
    url: 'api/ljToolsCloudMusic/batch',
    method: 'post',
    data
  })
}

export default { add, edit, del, batchCreate }
