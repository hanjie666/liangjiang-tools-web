import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/ljToolsKbsRecharge',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/ljToolsKbsRecharge/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/ljToolsKbsRecharge',
    method: 'put',
    data
  })
}
export function batchCreate(data) {
  return request({
    url: 'api/ljToolsKbsRecharge/batch',
    method: 'post',
    data
  })
}

export default { add, edit, del, batchCreate }
