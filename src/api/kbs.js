import request from '@/utils/request'

export function updateStep(data) {
  return request({
    url: '/kbs/step',
    method: 'post',
    data
  })
}

export function recharge(data) {
  return request({
    url: '/kbs/recharge',
    method: 'post',
    data
  })
}
export function auto(data) {
  return request({
    url: '/kbs/auto',
    method: 'post',
    data
  })
}

export default { updateStep, recharge, auto }
