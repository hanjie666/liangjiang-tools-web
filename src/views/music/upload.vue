<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">网易云用户cookie</label>
        <el-input v-model="query.cookie" clearable placeholder="网易云用户cookie" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
        <template v-slot:right>
          <el-button
            class="filter-item"
            size="mini"
            icon="el-icon-download"
            @click="showAdd = true"
          >批量导入</el-button>
        </template>
      </crudOperation>
      <el-dialog :close-on-click-modal="false" :visible.sync="showAdd" title="批量添加卡密" width="500px">
        <el-form ref="addData" :model="addData" :rules="rules" size="small" label-width="80px">
          <el-form-item label="cookie">
            <el-input
              v-model="textarea"
              type="textarea"
              :rows="10"
              placeholder=""
            />
          </el-form-item>
        </el-form>
        <el-button type="primary" style="float:right;" @click="importCookie">一键导入</el-button>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="showAdd = false">关闭界面</el-button>
        </div>
      </el-dialog>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" />
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="cookie" label="网易云用户cookie" />
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudLjToolsCloudMusicUpload from '@/api/ljToolsCloudMusicUpload'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { Notification } from 'element-ui'

const defaultForm = { id: null, token: null, cookie: null, musicUserId: null, status: null, totalNum: null, finishNum: null, taskRunDay: null, dateCreated: null, dateUpdated: null, sellLink: null, userId: null }
export default {
  name: 'LjToolCloudMusicUpload',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '网易云', url: 'api/ljToolsCloudMusic/upload', idField: 'id', sort: 'id,desc', crudMethod: { ...crudLjToolsCloudMusicUpload }})
  },
  data() {
    return {
      textarea: '',
      addData: {
        day: 300,
        num: 10
      },
      showAdd: false,
      permission: {
        add: [],
        edit: [],
        del: []
      },
      rules: {
      },
      queryTypeOptions: [
        { key: 'cookie', display_name: '网易云用户cookie' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    importCookie() {
      crudLjToolsCloudMusicUpload.importCookie({ cookie: this.textarea }).then(res => {
        Notification.success({
          title: '导入完成',
          duration: 3000
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
