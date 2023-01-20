<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">标题</label>
        <el-input v-model="query.articleTitle" clearable placeholder="标题" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="域名">
            <el-select v-model="form.domain" placeholder="请选择">
              <el-option
                v-for="item in domainList"
                :key="item.domain"
                :label="item.domain"
                :value="item.domain"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="标题" prop="articleTitle">
            <el-input v-model="form.articleTitle" style="width: 370px;" />
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
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="articleTitle" label="标题" />
        <el-table-column prop="articleNo" label="编号" />
        <el-table-column prop="createTime" label="创建日期" />
        <el-table-column label="操作" width="300px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="share(scope.row)">分享</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudLjToolsArticle from '@/api/ljToolsArticle'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import crudLjToolsDomain from '@/api/ljToolsDomain'

const defaultForm = { id: null, userId: null, jumpId: null, articleTitle: null, articleValue: null, articleNo: null, createBy: null, updateBy: null, createTime: null, updateTime: null, deleteAt: null }
export default {
  name: 'LjToolsArticle',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '文章', url: 'api/ljToolsArticle', idField: 'id', sort: 'id,desc', crudMethod: { ...crudLjToolsArticle }})
  },
  data() {
    return {
      permission: {
        add: [],
        edit: [],
        del: []
      },
      rules: {
        articleTitle: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'articleTitle', display_name: '标题' }
      ],
      domainList: [],
      domain: '',
      shareUrl: ''
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
    edit(row) {
      this.$router.push({
        name: 'ArticleEdit',
        params: {
          id: row.articleNo
        }
      })
    },
    getDomain() {
      crudLjToolsDomain.get().then(res => {
        console.log(res.content)
        this.domainList = res.content
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    // 点击事件
    share(row) {
      this.handleData(row)
      const _that = this
      this.$copyText(this.shareUrl).then(function(e) {
        _that.$notify({
          title: '复制文章链接成功',
          type: 'success',
          duration: 2500
        })
      }, function(e) {
        _that.$notify({
          title: '复制文章链接失败',
          type: 'error',
          duration: 2500
        })
      })
    },
    handleData(row) {
      this.shareUrl = 'http://tools.ljlju.cn' + '/card/' + row.articleNo
    }
  }
}
</script>

<style scoped>

</style>
