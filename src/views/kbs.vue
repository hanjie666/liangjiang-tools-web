<template>
  <el-row :gutter="10" style="width:100%; height:100%; display: flex; align-items:center;justify-content: center;">
    <el-col :xs="22" :sm="22" :md="22" :lg="16" :xl="12">
      <el-card class="box-card">
        <el-alert
          title="📢公告：本功能仅供娱乐学习 多运动有利身心健康"
          type="success"
          :closable="false"
        />
        <p>本站支持任何系统:苹果、安卓、PC、平板</p>
        <p>请把网站添加书签防走丢</p>
        <p>本站目前已支持邮箱提交，手机号提交</p>
        <div style="display: inline-block; margin-top: 5px">
          <el-button type="primary" round @click="help">使用教程</el-button>
          <!--          <el-button type="danger" round>联系客服</el-button>-->
        </div>
        <el-tabs v-model="activeName" style="margin-top: 10px" @tab-click="handleClick">
          <el-tab-pane label="手动" name="手动">
            <el-form label-position="right" label-width="80px" :model="manual">
              <el-form-item label="手机/邮箱:">
                <el-input v-model="manual.user" />
              </el-form-item>
              <el-form-item label="账号密码:">
                <el-input v-model="manual.password" />
              </el-form-item>
              <el-form-item label="运动步数:">
                <el-input v-model="manual.step" />
              </el-form-item>
            </el-form>
            <el-button type="primary" style="width: 100%" @click="manualStep">立即提交</el-button>
          </el-tab-pane>
          <el-tab-pane label="自动" name="自动">
            <el-form label-position="right" label-width="80px" :model="auto">
              <el-form-item label="手机/邮箱:">
                <el-input v-model="auto.user" />
              </el-form-item>
              <el-form-item label="账号密码:">
                <el-input v-model="auto.password" />
              </el-form-item>
              <el-form-item label="最小步数:" style="display: inline-block">
                <el-input v-model="auto.minStep" />
              </el-form-item>
              <el-form-item label="最大步数:" style="display: inline-block">
                <el-input v-model="auto.maxStep" />
              </el-form-item>
              <el-form-item label="定时时间:">
                <el-time-select
                  v-model="auto.stepTime"
                  :picker-options="{
                    start: '00:00',
                    step: '01:00',
                    end: '23:00'
                  }"
                  placeholder="选择时间"
                />
              </el-form-item>
            </el-form>
            <el-button type="primary" style="width: 100%" @click="autoStep()">立即提交</el-button>
          </el-tab-pane>
          <el-tab-pane label="充值" name="充值">
            <el-form label-position="right" label-width="80px" :model="recharge">
              <el-form-item label="手机/邮箱:">
                <el-input v-model="recharge.user" />
              </el-form-item>
              <el-form-item label="充值卡密:">
                <el-input v-model="recharge.code" />
              </el-form-item>
            </el-form>
            <el-button type="primary" style="width: 100%" @click="pay()">立即提交</el-button>
          </el-tab-pane>
          <el-tab-pane label="联系客服" name="联系客服">
            <el-form label-position="right" label-width="80px" :model="helpUser">
              <el-form-item label="手机/邮箱:">
                <el-input v-model="helpUser.user" />
              </el-form-item>
            </el-form>
            <el-button type="primary" style="width: 100%" @click="getHelpUser()">获取联系方式</el-button>
            <div style="padding-top: 10px; ">
              <el-tag size="small">客服QQ: {{ this.helpMessage.qq }}</el-tag>
            </div>
            <div style="padding-top: 10px; ">
              <el-tag size="small">客服微信: {{ this.helpMessage.wx }}</el-tag>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import kbsApi from '@/api/kbs'
import { getHelpUser } from '@/api/ljToolsKbsSetting'
import { Notification } from 'element-ui'
export default {
  name: 'Kbs',
  data() {
    return {
      activeName: '手动',
      manual: {
        user: '',
        password: '',
        step: ''
      },
      auto: {
        user: '',
        password: '',
        minStep: '',
        maxStep: '',
        stepTime: ''
      },
      recharge: {
        user: '',
        code: ''
      },
      helpUser: {
        user: ''
      },
      helpMessage: {

      }
    }
  },
  mounted() {
    if (localStorage.getItem('user') != null) {
      this.manual.user = localStorage.getItem('user')
      this.manual.password = localStorage.getItem('password')
      this.auto.user = localStorage.getItem('user')
      this.auto.password = localStorage.getItem('password')
      this.recharge.user = localStorage.getItem('user')
      this.helpUser.user = localStorage.getItem('user')
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    getHelpUser() {
      getHelpUser(this.helpUser.user).then(res => {
        this.helpMessage = res
        console.log(res)
      })
    },
    manualStep() {
      kbsApi.updateStep(this.manual).then(res => {
        if (res.includes('成功')) {
          localStorage.setItem('user', this.manual.user)
          localStorage.setItem('password', this.manual.password)
          Notification.success({
            title: res,
            duration: 3000
          })
        } else {
          Notification.error({
            title: res,
            duration: 3000
          })
        }
      })
    },
    autoStep() {
      kbsApi.auto(this.auto).then(res => {
        if (res.includes('成功')) {
          Notification.success({
            title: res,
            duration: 3000
          })
        } else {
          Notification.error({
            title: res,
            duration: 3000
          })
        }
      })
    },
    pay() {
      kbsApi.recharge(this.recharge).then(res => {
        if (res.includes('成功')) {
          Notification.success({
            title: res,
            duration: 3000
          })
        } else {
          Notification.error({
            title: res,
            duration: 3000
          })
        }
      })
    },
    help() {
      window.location.href = 'http://help.ljlju.cn/#/kbs/%E5%BE%AE%E4%BF%A1%E5%88%B7%E6%AD%A5%E6%95%99%E7%A8%8B'
    },
    qun() {
      window.location.href = 'https://jq.qq.com/?_wv=1027&k=bxCVi7vc'
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
</style>
