<template>
  <el-card class="box-card" style="margin-left: 3%;margin-right: 3%">
    <div slot="header" class="clearfix">
      <span><h3>{{ this.articleData.articleTitle }}</h3></span>
    </div>
    <div v-html="this.html" />
  </el-card>
</template>

<script>
import crudLjToolsArticle from '@/api/ljToolsArticle'

export default {
  name: 'ArticleCard',
  data() {
    return {
      html: '',
      articleData: {
        id: undefined,
        articleNo: undefined,
        articleValue: undefined
      }
    }
  },
  mounted() {
    const articleId = this.$route.params.id
    crudLjToolsArticle.get(articleId).then(res => {
      this.articleData = res
      this.html = res.articleValue
      window.document.title = res.articleTitle
    }).catch(err => {
      console.log(err.response.data.message)
    })
  }

}
</script>

<style scoped>

</style>
