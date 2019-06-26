<template>
  <div>
    <p>发布页面</p>
    <p>睡觉没前途(￣o￣) . z Z ٩꒰▽ ꒱۶⁼³₌₃ 学习去咯(。＿ 。） ✎＿学习计划走起(๑╹ヮ╹๑)ﾉ Studying makes me happy*✧⁺˚⁺ପ(๑･ω･)੭ु⁾⁾ 好好学习天天向上</p>
  <el-radio-group v-model="radio1" border="false">
    <el-radio-button label="上海" border="false"></el-radio-button>
    <el-radio-button label="北京" border="false"></el-radio-button>
    <el-radio-button label="广州" border="false"></el-radio-button>
    <el-radio-button label="深圳" border="false"></el-radio-button>
  </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'publish',
  data () {
    return {
      radio1: '上海'
    }
  }
}
</script>

<style lang="less" scoped>
</style>
