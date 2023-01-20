<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">备注</label>
        <el-input v-model="query.jumpMessage" clearable placeholder="备注" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="域名">
            <el-select v-model="form.jumpIp" placeholder="请选择">
              <el-option
                v-for="item in domainList"
                :key="item.domain"
                :label="item.domain"
                :value="item.domain"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="跳转地址" prop="goUrl">
            <el-input v-model="form.goUrl" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.jumpMessage" style="width: 370px;" />
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
        <el-table-column prop="jumpId" label="ID" type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="原来地址">
                <span>{{ props.row.oldUrl }}</span>
              </el-form-item>
              <el-form-item label="跳转地址">
                <span>{{ props.row.goUrl }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="jumpIp" label="域名" />
        <el-table-column prop="shortUrl" label="缩短链接">
          <template slot-scope="scope">
            {{ scope.row.jumpIp }}/{{ scope.row.shortUrl }}
          </template>
        </el-table-column>
        <el-table-column prop="jumpMessage" label="备注" />
        <el-table-column prop="count" label="点击数" />
        <el-table-column prop="createTime" label="创建日期" />
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
import crudLjToolsJump from '@/api/ljToolsJump'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import crudLjToolsDomain from '@/api/ljToolsDomain'

const defaultForm = { jumpId: null, userId: null, jumpIp: null, shortUrl: null, oldUrl: null, goUrl: null, jumpMessage: null, createBy: null, updateBy: null, createTime: null, updateTime: null, deleteAt: null }
export default {
  name: 'LjToolsJump',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '域名跳转', url: 'api/ljToolsJump', idField: 'jumpId', sort: 'jumpId,desc', crudMethod: { ...crudLjToolsJump }})
  },
  data() {
    return {
      permission: {
        add: [],
        edit: [],
        del: []
      },
      rules: {
        shortUrl: [
          { required: true, message: '缩短链接不能为空', trigger: 'blur' }
        ],
        oldUrl: [
          { required: true, message: '原来链接不能为空', trigger: 'blur' }
        ],
        goUrl: [
          { required: true, message: '跳转地址不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'jumpMessage', display_name: '备注' }
      ],
      domainList: [],
      domain: ''
    }
  },
  mounted() {
    this.getDomain()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    getDomain() {
      crudLjToolsDomain.get().then(res => {
        console.log(res.content)
        this.domainList = res.content
      }).catch(err => {
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
