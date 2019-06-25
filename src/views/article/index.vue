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
      <el-table class="list-table" :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </el-card>
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
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  created () {
    this.$http({
      method: 'GET',
      url: '/articles'
      // headers: { // 自定义发送请求头
      //   Authorization: `Bearer ${userInfo.token}`
      // }
    }).then(res => {
      console.log(res)
    })
  },
  methods: {
    onSubmit () {
      console.log('submit!')
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
