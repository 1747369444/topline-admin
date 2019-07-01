<template>
  <div>
    <!-- 筛选区域 -->
    <el-card class="top">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <el-form ref="form" :model="filterParams" label-width="80px">
        <el-form-item label="文章状态">
          <el-radio-group v-model="filterParams.status">
            <el-radio label>全部</el-radio>
            <el-radio
              v-for="(item, index) in statTypes"
              :key="item.label"
              :label="index + ''"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道列表">
          <!-- <el-select v-model="filterParams.channel_id" placeholder="请选择活动区域">
            <el-option label="全部" value></el-option>
            <el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>-->
          <article-channel v-model="filterParams.channel_id"></article-channel>
        </el-form-item>

        <el-form-item label="时间选择:">
          <el-date-picker
            v-model="begin_end_pubdate"
            value-format="yyyy-MM-dd"
            @change="handleDateChange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="articleLoading" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 展示列表表格 -->
    <el-card class="list-card">
      <div slot="header" class="clearfix">
        <span>
          共找到
          <strong>{{totalCount}}</strong>条符合条件的内容
        </span>
      </div>
      <el-table class="list-table" :data="tableData" style="width: 100%" v-loading="articleLoading">
        <el-table-column label="封面" width="80">
          <!-- prop="cover.images[0]"  -->
          <!-- 表格列的默认项只输出文本需要就自定义↓ -->
          <!-- slot-scope="scope"是插槽作用域，scope是起的一名scope中有个成员叫row，scope.row是当前的遍历项对象 -->
          <template slot-scope="scope">
            <img width="60" :src="scope.row.cover.images[0]" alt />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="pubdate" label="发布日期"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="操作">
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
      :disabled="articleLoading"
      :current-page="page"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
// const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
export default {
  name: 'ArticleList',
  components: {
    // 加载频道列表组件
    ArticleChannel
  },
  data () {
    return {
      tableData: [], // 数据列表
      totalCount: 0, // 总数据条数
      articleLoading: false, // 控制文档加载中的 loading 效果
      page: 1, // 当前页码
      statTypes: [ // 文章状态
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      // channels: [], // 频道列表
      filterParams: { // 文章查询条件参数
        status: '', // 文章状态
        channel_id: '', // 频道id
        begin_pubdate: '', // 开始时间
        end_pubdate: '' // 结束时间
      },
      begin_end_pubdate: [] // 存储日期选择器同步的 [开始时间，结束时间]，这个字段没啥用，
      // 只是日期选择器必须 v-mode 绑定一个数据才会触发 change 事件
    }
  },
  created () {
    // 加载文章列表
    this.loadArticles()
  },
  methods: {
    // 获取文章展示数据
    loadArticles (page = 1) { // 函数参数的默认值不传默认为1传了就用传的
      this.articleLoading = true // 请求时禁用分页&表格加载
      // 过滤出有效的查询条件字段
      const filterData = {}
      for (let key in this.filterParams) {
        if (this.filterParams[key]) {
          filterData[key] = this.filterParams[key]
        }
      }
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page, // 请求数据的页码，不传默认为1
          per_page: 10, // 请求数据的每页大小，不传默认为10
          ...filterData// 将对象解构混入当前对象，说白就是对象拷贝
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
    // 查询
    onSubmit () {
      // console.log('submit!')
      this.page = 1 // 让页码回到第一页
      this.loadArticles() // 加载第一页数据
    },
    // 分页
    handleCurrentChange (page) {
      this.page = page
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
    },
    //  日期选择组件改变事件
    handleDateChange (value) {
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
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
