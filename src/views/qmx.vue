<template>
  <div>
    <van-notice-bar
      left-icon="volume-o"
      text="良匠QQ：188177020。"
    />
    <van-form style="margin-top: 10px">
      <van-field
        v-model="manual.phone"
        name="手机号"
        label="手机号"
        placeholder="手机号"
      />
      <van-field
        v-model="manual.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
      />
      <van-field
        v-model="manual.storyId"
        name="storyId"
        label="地图"
        placeholder="地图ID"
      />
      <van-field
        v-model="manual.stageId"
        name="stageId"
        label="关卡ID"
        placeholder="关卡ID"
      />
      <!--      <van-field-->
      <!--        v-model="manual.barkToken"-->
      <!--        name="barkToken"-->
      <!--        label="通知token"-->
      <!--        placeholder="通知token，只填一次即可"-->
      <!--      />-->
      <div style="margin-top: 16px;padding-left: 35px">
        <van-row>
          <van-col span="6">
            <van-button size="small" plain type="primary" @click="login">登录账号</van-button>
          </van-col>
          <van-col span="6">
            <van-button size="small" plain type="primary" @click="logout">退出账号</van-button>
          </van-col>
          <van-col span="6">
            <van-button size="small" plain type="primary" @click="getRework">查询奖励</van-button>
          </van-col>
          <van-col span="6">
            <van-button size="small" plain type="primary" @click="qun">黑科技群</van-button>
          </van-col>
        </van-row>
      </div>
    </van-form>
    <van-cell v-for="item in list" :key="item" :title="item" />
  </div>
</template>

<script>
import axios from 'axios'

import Vue from 'vue'
import { Button } from 'vant'
import { Form } from 'vant'
import { Field } from 'vant'
import { Col, Row } from 'vant'
import { List } from 'vant'
import { Cell, CellGroup } from 'vant'
import { Toast } from 'vant'
import { NoticeBar } from 'vant'

Vue.use(NoticeBar)
Vue.use(Toast)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(List)
Vue.use(Col)
Vue.use(Row)
Vue.use(Form)
Vue.use(Field)
Vue.use(Button)
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : 'http://localhost:8000'
})
export default {
  name: 'Qmx',
  data() {
    return {
      manual: {
        phone: '',
        password: '',
        barkToken: '',
        storyId: '',
        stageId: '',
        platform: '启明星'
      },
      list: [],
      loading: false
    }
  },
  methods: {
    getRework() {
      service.get('/api/sbe/list?phone=' + this.manual.phone)
        .then(response => {
          this.list = response.data
          this.loading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    qun() {
      window.open('http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=qD1fwlERWpgD_DMCQ-2SClgEiZWs78wu&authKey=ArtxlbxkBaY8EcOniHMr6ckC9NTFUtojRkiXv4ly7Y8v24j3YJjqpPmckjXV5xaL&noverify=0&group_code=696731853', '_blank')
    },
    login() {
      service.get('/api/qmx/login?phone=' + this.manual.phone + '&password=' + this.manual.password +
        '&stageId=' + this.manual.stageId + '&storyId=' + this.manual.storyId + '&platform=' + this.manual.platform)
        .then(response => {
          Toast.success(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    logout() {
      service.get('/api/sbe/userLogout?phone=' + this.manual.phone + '&password=' + this.manual.password)
        .then(response => {
          Toast.success(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>

</style>
