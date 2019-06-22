<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form"></div>
      <el-form ref="form" :model="fromData">
        <el-form-item>
          <el-input v-model="fromData.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <!-- 支持栅格布局 -->
        <el-form-item>
          <el-col :span="10">
            <el-input v-model="fromData.code" placeholder="验证码"></el-input>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-button>获取验证码</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Applogin',
  data () {
    return {
      fromData: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("./login_bg.jpg");
  background-size: 100%;
  .login-head {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  .login-form-wrap {
    background-color: #fff;
    padding: 50px;
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  }
}
</style>
