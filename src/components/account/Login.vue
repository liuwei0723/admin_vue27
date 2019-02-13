<template>
  <div>
    <!-- 表单容器 -->
    <el-form
      :model="userForm"
      :rules="rules"
      ref="userForm"
      label-width="0px"
      class="login-container"
    >
      <h3 class="title">电商后台管理系统登录</h3>
      <el-form-item prop="username">
        <el-input v-model="userForm.username" prefix-icon="iconfont icon-login_user"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="userForm.password"
          type="password"
          prefix-icon="iconfont icon-login_password"
        ></el-input>
      </el-form-item>
      <!-- `checked` 为 true 或 false -->
      <el-form-item>
      <el-checkbox v-model="checked">记住密码</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="login" style="width:100%">登录</el-button>
      </el-form-item> 
    </el-form>
  </div>
</template>

<script>
//导出一个组件的Vue实例
// 导入axios
// import axios from 'axios'
export default {
  data() {
    return {
      loading: false,
      userForm: {
        username: 'admin',
        password: '123456'
      },
      //验证表单项使用的
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      checked: true
    }
  },
  methods: {
    login() {
      //拿到了整个el-form,然后调用el-form的valid
      this.$refs.userForm.validate(vaild => {
        if (vaild) {
          this.loading = true
          this.$axios
            .post('login', this.userForm)
            .then(res => {
              this.loading = false
              console.log(res);
              
              if (res.data.meta.status !== 200) {
                //登录失败
                this.$message.error(res.data.meta.msg)
              } else {
                this.$message({message:'登录成功',type:'success'})
                // console.log(res.data.data);
                localStorage.setItem('mytoken',res.data.data.token)

                
                this.$router.push('/layout/users')
              }
            })
        }
      })
    }
  }
}
</script>


<style scoped>

.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 100px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
.remember {
  margin: 0px 0px 35px 0px;
}
</style>