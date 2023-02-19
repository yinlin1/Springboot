<template>
  <div class="login">
    <div style="margin: 200px auto; background-color: #fff;width: 450px;height: 350px; padding: 20px;border-radius: 10px">
      <div style="margin: 20px 0;text-align: center; font-size: 24px"><b>Register</b></div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" size="medium" style="margin: 5px 0" prefix-icon="el-icon-user" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="nickname">
          <el-input placeholder="请输入昵称" size="medium" style="margin: 5px 0" prefix-icon="el-icon-user" v-model="user.nickname"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" size="medium" style="margin: 5px 0" prefix-icon="el-icon-lock" show-password v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input placeholder="请确认密码" size="medium" style="margin: 5px 0" prefix-icon="el-icon-lock" show-password v-model="user.repassword"></el-input>
        </el-form-item>
        <div style="margin: 10px 0; text-align: right">
          <el-button type="primary" size="small" autocomplete="off" @click="login">注册</el-button>
          <el-button type="warning" size="small" autocomplete="off" @click="relogin">返回登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "register",
  data(){
    return {
      user: {},
      rules: {
        username: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur'}
        ],
        repassword: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入昵称', trigger: 'blur'},
          {min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods:{
    login(){
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          if (this.user.password !== this.user.repassword){
            this.$message.error("两次确认密码不一致！")
            return false
          }
          this.request.post("/user/register",this.user).then(res => {
            if (res.code === "200"){
              // console.log(res)
              this.$message.success("用户注册成功！")
              this.$router.push('/login')
            }else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    },
    relogin(){
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
.login{
  height: 100vh;
  background-image: url("../images/three.jpg");
  background-size: 100%;
  overflow: hidden;
}
</style>
