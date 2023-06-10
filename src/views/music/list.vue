<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">token</label>
        <el-input v-model="query.token" clearable placeholder="token" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          >批量生成卡密</el-button>
        </template>
      </crudOperation>
      <el-dialog :close-on-click-modal="false" :visible.sync="showAdd" title="批量添加卡密" width="500px">
        <el-form ref="addData" :model="addData" :rules="rules" size="small" label-width="80px">
          <el-form-item label="听歌数量">
            <el-input v-model="addData.day" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="addData.num" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数量">
            <el-input
              v-model="textarea"
              type="textarea"
              :rows="10"
              placeholder=""
            />
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="create">生成</el-button>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="showAdd = false">取消</el-button>
          <el-button type="primary" @click="addRecharge">确认</el-button>
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
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="token" label="token" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="totalNum" label="卡密听歌数量" />
        <el-table-column prop="finishNum" label="已听数量" />
        <el-table-column prop="dateCreated" label="创建时间" />
        <el-table-column prop="dateUpdated" label="更新时间" />
        <el-table-column prop="sellLink" label="售卖链接" />
        <el-table-column v-if="checkPer(['admin','ljToolsCloudMusic:edit','ljToolsCloudMusic:del'])" label="操作" width="150px" align="center">
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
import crudLjToolsCloudMusic from '@/api/ljToolsCloudMusic'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, token: null, cookie: null, musicUserId: null, status: null, totalNum: null, finishNum: null, taskRunDay: null, dateCreated: null, dateUpdated: null, sellLink: null, userId: null }
export default {
  name: 'LjToolsCloudMusic',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '网易云', url: 'api/ljToolsCloudMusic', idField: 'id', sort: 'id,desc', crudMethod: { ...crudLjToolsCloudMusic }})
  },
  data() {
    return {
      permission: {
        add: [],
        edit: [],
        del: []
      },
      showAdd: false,
      rules: {
      },
      queryTypeOptions: [
        { key: 'token', display_name: 'token' }
      ],
      addData: {
        day: 30,
        num: 10
      },
      textarea: ''
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    create() {
      this.textarea = ''
      crudLjToolsCloudMusic.batchCreate(this.addData).then(res => {
        for (let i = 0; i < res.length; i++) {
          this.textarea = this.textarea + res[i] + '\n'
        }
      })
    },
    addRecharge() {
      this.showAdd = false
      this.crud.refresh()
    }
  }
}
</script>

<style scoped>

</style>
