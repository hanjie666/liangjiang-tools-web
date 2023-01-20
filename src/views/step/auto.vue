<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">用户</label>
        <el-input v-model="query.phone" clearable placeholder="用户" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="用户" prop="phone">
            <el-input v-model="form.phone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="运行时间">
            <el-input v-model="form.runTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="开启状态">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="最小步数">
            <el-input v-model="form.miniStep" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="最大步数">
            <el-input v-model="form.maxStep" style="width: 370px;" />
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
        <el-table-column prop="phone" label="用户" />
        <el-table-column prop="runTime" label="运行时间" />
        <el-table-column prop="status" label="开启状态" />
        <el-table-column prop="miniStep" label="最小步数" />
        <el-table-column prop="maxStep" label="最大步数" />
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
import crudLjToolsKbsAuto from '@/api/ljToolsKbsAuto'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, userId: null, phone: null, runTime: null, status: null, miniStep: null, maxStep: null }
export default {
  name: 'LjToolsKbsAuto',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '自动任务', url: 'api/ljToolsKbsAuto', idField: 'id', sort: 'id,desc', crudMethod: { ...crudLjToolsKbsAuto }})
  },
  data() {
    return {
      permission: {
        add: [],
        edit: [],
        del: []
      },
      rules: {
        phone: [
          { required: true, message: '用户不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'phone', display_name: '用户' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
