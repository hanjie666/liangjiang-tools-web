<template>
  <div class="container-fluid">
    <div v-if="loginSuccess" class="card">
      <el-loading size="large" />
      <div class="card-header">网易云代挂信息</div>
      <div class="card-body">
        <div class="info-row">
          <div class="info-title">用户昵称</div>
          <div class="info-value">{{ userInfo.nickName }}</div>
        </div>
        <div class="info-row">
          <div class="info-title">订单任务目标</div>
          <div class="info-value">{{ userInfo.totalNum }} 首</div>
        </div>
        <div class="info-row">
          <div class="info-title">为您代听了</div>
          <div class="info-value">{{ userInfo.finishNum }} 首</div>
        </div>
        <div class="info-row">
          <div class="info-title">任务已进行了</div>
          <div class="info-value">{{ userInfo.taskRunDay }} 天</div>
        </div>
        <div class="info-row">
          <div class="info-title">任务当前状态</div>
          <div v-if="userInfo.status == 1" class="info-value" style="color: red">任务完成</div>
          <div v-else class="info-value" style="color: blue">进行中...</div>
        </div>
        <el-divider />
        <div class="info-row">
          <div class="info-title">下单前听歌量</div>
          <div class="info-value">{{ userInfo.userBeforeNum }} 首</div>
        </div>
        <div class="info-row">
          <div class="info-title">现在的听歌量</div>
          <div class="info-value">{{ userInfo.userListenSong }} 首</div>
        </div>
        <div class="info-row">
          <div class="info-title">您的当前等级</div>
          <div class="info-value">{{ userInfo.level }} 级</div>
        </div>
        <div class="info-row">
          <div class="info-title">升级还需听歌</div>
          <div class="info-value">{{ userInfo.nextPlayCount }} 首</div>
        </div>
        <div class="info-row">
          <div class="info-title">升级还需登录</div>
          <div class="info-value">{{ (userInfo.nextLoginCount - userInfo.nowLoginCount) }} 天</div>
        </div>
        <el-divider />
        <div class="info-row">
          <div class="info-title">最近执行日期</div>
          <div v-if="userInfo.dateUpdated != null" class="info-value">{{ userInfo.dateUpdated.substring(0, 10) }}</div>
          <div v-else class="info-value">{{ userInfo.dateUpdated }}</div>
        </div>
        <div class="info-row" :class="{ 'font-weight-bold': true, 'text-danger': true }">
          <div class="info-title">说明信息(必读)</div>
        </div>
        <div class="info-value" style="color: red">
          1. 任务已经完成<br><br>
          2. 网易云每天最多统计300听歌量，您下单前当天已有听过一些或者刷过了，这边代听就达不到300<br><br>
          3. 300的订单一天内不可以重复下单，网易云每天最多统计300听歌量，一天内多次代听没用<br><br>
          4. 推荐下单3000以上订单，只需要一次登录，之后不用任何操作，每天自动代听歌代登录

        </div>
      </div>
    </div>
    <el-row v-if="!loginSuccess" v-loading="userinfoLoading" :gutter="10" style="width:100%; height:100%; display: flex; align-items:center;justify-content: center;">
      <el-col :xs="22" :sm="22" :md="22" :lg="16" :xl="12">
        <el-card v-loading="userinfoLoading" class="box-card" style="text-align: center;">
          <el-tabs v-model="activeName" style="margin-top: 10px">
            <el-tab-pane label="扫码登录" name="扫码登录">
              <el-image v-show="qrCode != ''" :src="qrCode" style="width: 200px; height: 200px; display: block; margin: 0 auto;" fit="cover" />

              <el-button type="primary" round @click="generateQRCode">生成二维码</el-button>
              <el-button type="primary" round @click="getUserInfo">扫码完成</el-button>
              <br><br><br><br>
              <div style="color: #f4516c">1.点击生成二维码按钮获取登录二维码</div>
              <br>
              <div style="color: #f4516c">2.截图二维码打开网易云扫一扫</div>
              <br>
              <div style="color: #f4516c">3.扫码完成后记得点击"扫码完成"按钮</div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import axios from 'axios'
import { Notification } from 'element-ui'
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : 'http://localhost:8000'
})
export default {
  name: 'Music',
  data() {
    return {
      userInfo: {},
      loginSuccess: false,
      activeName: '扫码登录',
      qrCode: '',
      token: '',
      userinfoLoading: true
    }
  },
  mounted() {
    this.token = this.$route.query.token || ''
    this.$nextTick(() => {
      this.getTaskInfo()
    })
    console.log(this.loginSuccess)
  },
  methods: {
    generateQRCode() {
      service.get('/api/music/qrCode/' + this.token)
        .then(response => {
          // 生成二维码数据，并将数据绑定到组件的 qrCode 属性中
          QRCode.toDataURL(response.data, { width: 200 })
            .then(url => {
              this.qrCode = url
            })
            .catch(err => {
              console.error(err)
            })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getUserInfo() {
      service.get('/api/music/userInfo/' + this.token)
        .then(response => {
          Notification.success({
            title: response.data,
            duration: 3000
          })
          if (response.data === ('授权登陆成功')) {
            this.getTaskInfo()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getTaskInfo() {
      this.userinfoLoading = true
      service.get('/api/music/userTask/' + this.token)
        .then(response => {
          if (response.data.musicUserId > 0) {
            this.userInfo = response.data
            console.log(response.data)
            this.loginSuccess = true
            this.$forceUpdate()
          }
        })
        .catch(error => {
          console.log(error)
        })
      this.userinfoLoading = false
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 100%;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.info-title {
  flex-basis: 60%;
}

.info-value {
  flex-grow: 1;
}

.card {
  margin: 20px auto;
  width: 90%;
  background-color: #fff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}

.card-header {
  padding: 15px 20px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  background-color: #f4516c;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.card-body {
  padding: 20px;
  font-size: 16px;
}
</style>
