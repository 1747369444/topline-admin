<template>
  <div>
    <!-- 筛选区域 -->
    <el-card class="top">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="文章状态:">
          <el-radio-group v-model="form.resource">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表:">
          <el-select v-model="form.region" placeholder="请选择">
            <el-option label="css" value="shanghai"></el-option>
            <el-option label="数据库" value="beijing"></el-option>
            <el-option label="区块链" value="beijing"></el-option>
            <el-option label="go" value="beijing"></el-option>
            <el-option label="产品" value="beijing"></el-option>
            <el-option label="后端" value="beijing"></el-option>
            <el-option label="linux" value="beijing"></el-option>
            <el-option label="人工智能" value="beijing"></el-option>
            <el-option label="php" value="beijing"></el-option>
            <el-option label="javascript" value="beijing"></el-option>
            <el-option label="架构" value="beijing"></el-option>
            <el-option label="前端" value="beijing"></el-option>
            <el-option label="python" value="beijing"></el-option>
            <el-option label="java" value="beijing"></el-option>
            <el-option label="算法" value="beijing"></el-option>
            <el-option label="面试" value="beijing"></el-option>
            <el-option label="科技动态" value="beijing"></el-option>
            <el-option label="js" value="beijing"></el-option>
            <el-option label="设计" value="beijing"></el-option>
            <el-option label="数码产品" value="beijing"></el-option>
            <el-option label="html" value="beijing"></el-option>
            <el-option label="软件测试" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间选择:">
          <el-date-picker
            v-model="form.value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 展示列表表格 -->
    <el-card class="list-card">
      <div slot="header" class="clearfix">
        <span>共找到15条符合条件的内容</span>
      </div>
      <el-table class="list-table" :data="tableData" style="width: 100%" v-loading="articleLoading">
        <el-table-column label="封面" width="80">
          <!-- prop="cover.images[0]"  -->
          <!-- 表格列的默认项只输出文本需要就自定义↓ -->
          <!-- slot-scope="scope"是插槽作用域，scope是起的一名scope中有个成员叫row，scope.row是当前的遍历项对象 -->
          <!-- <template slot-scope="scope">
            <img :src="scope.row.cover.images[0]" alt>
          </template>-->
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="pubdate" label="发布日期"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-button type="success" plain>修改</el-button>
            <el-button type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      @current-change="handleCurrentChange"
      :disabled="articleLoading"
    ></el-pagination>
  </div>
</template>

<script>
// const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
export default {
  name: 'ArticleList',
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        value1: ''
      },
      tableData: [],
      totalCount: 0,
      articleLoading: false

    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    // 获取文章展示数据
    loadArticles (page = 1) { // 函数参数的默认值不传默认为1传了就用传的
      this.articleLoading = true // 请求时禁用分页&表格加载
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page, // 请求数据的页码，不传默认为1
          per_page: 10 // 请求数据的每页大小，不传默认为10
        }
        // headers: { // 自定义发送请求头
        // Authorization: `Bearer ${userInfo.token}`
        // }
      }).then(data => {
        // console.log(data)
        this.tableData = data.results // 列表数据
        this.totalCount = data.total_count// 数据总数
        this.articleLoading = false// 请求完成分页能点&表格显示
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    // 分页
    handleCurrentChange (page) {
      // 页码改变请求页码对应的数据
      this.loadArticles(page)
    },
    // 删除
    handleDelete (articles) {
      this.$confirm('确定删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求删除
        this.$http({
          method: 'DELETE',
          url: `/articles/${articles.id}`
        }).then(data => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新加载数据列表
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // console.log(articles)
    }
  }
}
</script>

<style lang="less" scoped>
.top {
  margin-bottom: 20px;
}
.list-table {
  margin-bottom: 30px;
}
</style>
