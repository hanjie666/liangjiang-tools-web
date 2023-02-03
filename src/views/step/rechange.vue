<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">卡密内容</label>
        <el-input v-model="query.code" clearable placeholder="卡密内容" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">被使用的手机号</label>
        <el-input v-model="query.phone" clearable placeholder="被使用的手机号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
          <el-form-item label="天数">
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
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="卡密内容">
            <el-input v-model="form.code" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="天数">
            <el-input v-model="form.data" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="使用状态">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="主键ID" />
        <el-table-column prop="code" label="卡密内容" />
        <el-table-column prop="data" label="天数" />
        <el-table-column prop="status" label="使用状态" />
        <el-table-column prop="phone" label="被使用的手机号" />
        <el-table-column prop="activationTime" label="激活时间" />
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
import crudLjToolsKbsRecharge from '@/api/ljToolsKbsRecharge'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, code: null, data: null, status: null, phone: null, activationTime: null }
export default {
  name: 'LjToolsKbsRecharge',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '步数卡密', url: 'api/ljToolsKbsRecharge', idField: 'id', sort: 'id,desc', crudMethod: { ...crudLjToolsKbsRecharge }})
  },
  data() {
    return {
      textarea: '',
      // textarea: undefined,
      addData: {
        day: 3,
        num: 1
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
        { key: 'code', display_name: '卡密内容' },
        { key: 'phone', display_name: '被使用的手机号' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    create() {
      this.textarea = ''
      crudLjToolsKbsRecharge.batchCreate(this.addData).then(res => {
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
