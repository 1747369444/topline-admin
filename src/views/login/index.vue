<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt="黑马头条">
      </div>
      <div class="login-form"></div>
      <el-form ref="form" :model="fromData" :rules="rules">
        <el-form-item prop="mobile">
          <el-input v-model="fromData.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <!-- 支持栅格布局 -->
        <el-form-item prop="code">
          <el-col :span="10">
            <el-input v-model="fromData.code" placeholder="验证码"></el-input>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-button @click="handleSendCode">获取验证码</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button
            class="btn-login"
            type="primary"
            :loading="loginloading"
            @click="handleLogin"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt'
export default {
  name: 'Applogin',
  data () {
    return {

      fromData: {// 表单数据
        mobile: '',
        code: ''
      },
      loginloading: false, // 登录按钮的loading状态
      rules: {// 表单验证规则
        mobile: [
          { required: true, message: '请输入正确手机号', trigger: 'blur' },
          { len: 11, message: '长度必须为11个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度必须为6个字符', trigger: 'blur' }
        ]
      },

      captchaObj: null // 通过initGeetest得到的极验验证码
    }
  },
  methods: {
    handleLogin () {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        // 表单验证成功，才提交登录
        this.submitLogin()
      })
    },

    submitLogin () {
      this.loginloading = true
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.fromData
      }).then(res => {
        //   console.log(res.data)
        this.$message({
          message: '恭喜你,登录成功！！！',
          type: 'success'
        })

        this.loginloading = false

        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        //   console.dir(err)
        if (err.request.status === 400) {
          this.$message.error('登录失败，手机号或验证码错误！！！')
        }
        this.loginloading = false
      })
    },

    handleSendCode () {
      const { mobile } = this.fromData

      if (this.captchaObj) {
        return this.captchaObj.verify()
      }

      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        // console.log(res.data.data)
        const data = res.data.data
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隐藏按钮式
        }, (captchaObj) => {
          this.captchaObj = captchaObj
          // 这里可以调用验证实例 captchaObj 的实例方法:验证码对象
          captchaObj.onReady(function () {
            // onReady极验提供的一个相当于生命周期的东西
            captchaObj.verify() // 显示验证码
          }).onSuccess(function () {
            // console.log(captchaObj.getValidate())
            // 解构captchaObj.getValidate()的值
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } =
              captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                seccode,
                validate
              }
            }).then(res => {
              console.log(res.data)
            })
          })
        })
      })
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
