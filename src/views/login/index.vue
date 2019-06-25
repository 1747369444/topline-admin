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
            <el-button
              @click="handleSendCode"
              :disabled="!!codeTimer||codeLoading"
            >{{codeTimer?`剩余${codeSecons}秒`:'获取验证码'}}</el-button>
          </el-col>
        </el-form-item>
        <!-- 多选框 -->
        <el-form-item prop="agree">
          <el-checkbox v-model="fromData.agree"></el-checkbox>
          <span>
            我已阅读并同意
            <a href="#">用户协议</a>和
            <a href="#">隐私条款</a>
          </span>
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
// import axios from 'axios'
import '@/vendor/gt'
const initCodeSeconds = 20
export default {
  name: 'Applogin',
  data () {
    return {

      fromData: {// 表单数据
        mobile: '',
        code: '',
        agree: ''// 是否同意用户协议
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
        ],
        agree: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          { pattern: /true/, message: '请同意用户协议', trigger: 'change' }
        ]
      },
      captchaObj: null, // 通过initGeetest得到的极验验证码
      codeTimer: null, // 倒计时定时器
      codeSecons: initCodeSeconds, // 倒计时的时间
      sendMobile: '', // 保存初始化验证码之后发送短信的手机号
      codeLoading: false
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
      this.$http({
        method: 'POST',
        url: '/authorizations',
        data: this.fromData
      }).then(data => {
        //   console.log(res.data)
        // 登录 成功将接口返回的登录信息存储到本地存储中方便后续使用
        window.localStorage.setItem('user_info', JSON.stringify(data))
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
      // console.log(errorMessage)这个是哪个错误消息如果moblie通过是空字符串
      // 校验手机号是否有效
      this.$refs['form'].validateField('mobile', errorMessage => {
        if (errorMessage.trim().length > 0) {
          return
        }
        // // 手机号码有效，初始化验证码插件
        // this.showGeetest()

        // 手机号验证通过
        if (this.captchaObj) {
          // 手机号码有效，初始化验证码插件
          // this.showGeetest()
          // 如果用户输入的手机号和之前初始化的验证码手机号不一致，就基于当前手机号码重新初始化
          // 否则，直接 verify 显示
          if (this.fromData.mobile !== this.sendMobile) {
            // 手机号发生改变,从新初始化验证码插件

            // 重新初始化之前，将原来的验证码插件生成的DOM删除
            document.body.removeChild(document.querySelector('.geetest_panel'))

            // 重新初始化
            this.showGeetest()
          } else {
            // 手机号一致的话，直接verify
            this.captchaObj.verify()
          }
        } else {
          // 这是第一次初始化的验证码插件
          this.showGeetest()
        }
      })
    },

    showGeetest () {
      // 函数中的 function 定义的函数中的 this 指向 window

      // 初始化验证码期间，禁用获取验证按钮
      this.codeLoading = true
      this.$http({
        method: 'GET',
        url: `/captchas/${this.fromData.mobile}`
      }).then(data => {
        // console.log(res.data.data)
        // const data = res.data.data
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
          captchaObj.onReady(() => {
            // onReady极验提供的一个相当于生命周期的东西
            captchaObj.verify() // 显示验证码
            // 验证码初始化好了，让 “获取验证码” 按钮可点击
            this.codeLoading = false
          }).onSuccess(() => {
            // console.log(captchaObj.getValidate())
            // 解构captchaObj.getValidate()的值
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } =
              captchaObj.getValidate()
            this.$http({
              method: 'GET',
              url: `/sms/codes/${this.fromData.mobile}`,
              params: {
                challenge,
                seccode,
                validate
              }
            }).then(data => {
              // console.log(res.data)
              // 发送短信之后，才开始倒计时
              this.codeCountDown()
            })
          })
        })
      })
    },
    //
    // 倒计时
    //
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        // 时间--
        this.codeSecons--
        if (this.codeSecons <= 0) {
          this.codeSecons = initCodeSeconds // 让倒计时时间回到初始状态
          window.clearInterval(this.codeTimer) // 清除定时器
          this.codeTimer = null // 清除倒计时的标记
        }
      }, 1000)
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
  a {
    text-decoration: none;
  }
}
</style>
