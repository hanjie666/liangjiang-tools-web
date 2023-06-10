<template>
  <div>
    <el-form label-position="right" label-width="80px">
      <el-form-item label="手机:">
        <el-input v-model="manual.phone" style="width: 240px" />
      </el-form-item>
      <el-form-item label="密码:">
        <el-input v-model="manual.password" style="width: 240px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 30%;float: left" @click="saveUser">上号</el-button>
        <el-button type="primary" style="width: 30%;" @click="saveUser">下号</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import { Notification } from 'element-ui'
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : 'http://localhost:8000'
})
export default {
  name: 'Qt',
  data() {
    return {
      manual: {
        phone: '',
        password: ''
      }
    }
  },
  methods: {
    saveUser() {
      service.get('/api/qt/save?phone=' + this.manual.phone + '&password=' + this.manual.password)
        .then(response => {
          Notification.error({
            title: response.data,
            duration: 3000
          })
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
