<template>
  <div class="app-container">
    <div class="head-container">
      <el-button size="mini" type="primary" @click="goBack">返回</el-button>
      <el-button size="mini" type="primary" style="float: right" @click="save">保存</el-button>

    </div>
    <div style="border: 1px solid #ccc;">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :default-config="toolbarConfig"
        :mode="mode"
      />
      <Editor
        v-model="html"
        style="height: 500px; overflow-y: hidden;"
        :default-config="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
      />
    </div>
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { DomEditor } from '@wangeditor/editor'
import crudLjToolsArticle from '@/api/ljToolsArticle'

export default {
  name: 'ArticleEdit',
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      html: '',
      articleData: {
        id: undefined,
        articleNo: undefined,
        articleValue: undefined
      },
      toolbarConfig: {},
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          // 配置上传图片
          uploadImage: {
            fieldName: 'file',
            server: 'http://43.156.235.28:8000/api/ljToolsArticle/upload'
            // meta: {
            //   Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIzMjc1NTI5NGY1Y2Y0YWJhOGRjNThjM2I5MDM0MTUzOCIsInVzZXIiOiJhZG1pbiIsInN1YiI6ImFkbWluIn0.gDrzXbvehZWWBVf2vqNvPIotyOPBgO9e9ovhM4VT-BWa-viVsOPdxWj0f01K59aKJ-PAdPzYi_GyB3k84vPohA'
            // }
          }
        }
      }
    }
  },
  mounted() {
    const articleId = this.$route.params.id
    crudLjToolsArticle.get(articleId).then(res => {
      this.articleData = res
      this.html = res.articleValue
    }).catch(err => {
      console.log(err.response.data.message)
    })
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor)
      console.log(this.editor.getHtml())
      this.$nextTick(() => {
        const toolbar = DomEditor.getToolbar(editor)

        const curToolbarConfig = toolbar.getConfig()
        curToolbarConfig.excludeKeys = ['fullScreen']
        console.log(curToolbarConfig.toolbarKeys)
      })
    },
    save() {
      this.articleData.articleValue = this.editor.getHtml()
      crudLjToolsArticle.edit(this.articleData).then(res => {
        this.$notify({
          title: res,
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>

