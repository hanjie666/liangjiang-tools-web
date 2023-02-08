<template>
  <el-card class="box-card">
    <el-form v-model="info" style="margin-top: 10px;" size="small" label-width="65px">
      <el-form-item label="微信" prop="nickName">
        <el-input v-model="info.wx" style="width: 35%" />
        <span style="color: #C0C0C0;margin-left: 10px;">客服微信</span>
      </el-form-item>
      <el-form-item label="QQ" prop="phone">
        <el-input v-model="info.qq" style="width: 35%;" />
        <span style="color: #C0C0C0;margin-left: 10px;">客服qq</span>
      </el-form-item>
      <el-form-item label="发卡网" prop="codeUrl">
        <el-input v-model="info.codeUrl" style="width: 35%;" />
        <span style="color: #C0C0C0;margin-left: 10px;">发卡网地址</span>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="doSubmit">保存配置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>

import { add, get } from '@/api/ljToolsKbsSetting'
import { Notification } from 'element-ui'
export default {
  name: 'LjToolsKbsSetting',
  data() {
    return {
      info: {
        wx: '',
        qq: '',
        codeUrl: ''
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      get().then((res) => {
        if (res.content.length > 0) {
          this.info = res.content[0]
        }
      }).catch(() => {

      })
    },
    doSubmit() {
      add(this.info).then(() => {
        this.saveLoading = false
        Notification.success({
          title: '保存成功',
          duration: 3000
        })
      }).catch(() => {
        this.saveLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
