<template>
   <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      router
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <div class="images">
        <img src="./logo_admin.png" alt="黑马头条" width="120">
      </div>
       <el-menu-item index="/">
        <i class="iconfont iconHOMEMESSAGE"></i>
        <span slot="title">首页</span>
      </el-menu-item>
        <el-submenu index="1">
        <template slot="title">
          <i class="iconfont iconxuanyunbiaoqing"></i>
          <!-- <span>内容管理</span> -->
          <span>内容</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/publish">发布文章</el-menu-item>
          <el-menu-item index="1-2">内容列表</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="1-3">评论列表</el-menu-item>
          <el-menu-item index="1-4">素材管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="iconfont iconcaimibiaoqing"></i>
          <span>粉丝管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="2-1">图文数据</el-menu-item>
          <el-menu-item index="2-2">粉丝概况</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item index="2-3">粉丝画像</el-menu-item>
          <el-menu-item index="2-4">粉丝列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="4">
        <i class="iconfont iconhuachibiaoqing"></i>
        <span slot="title">账户信息</span>
      </el-menu-item>
    </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  data () {
    return {}
  },
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.images{
  text-align: center;
  height: 60px;
  background-color: #222;
  img{
    margin-top: 15px;
  }
}
</style>
