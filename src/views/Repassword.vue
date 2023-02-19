<template>
  <el-card style="width: 500px;padding: 20px;border: 1px solid #ccc">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="原密码" prop="password">
        <el-input placeholder="请输入密码" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input placeholder="请输入新密码" v-model="form.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确定密码" prop="rePassword">
        <el-input placeholder="请确认新密码" v-model="form.rePassword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add">确 定</el-button>
        <el-button type="primary" @click="canle">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import router from "@/router";
import request from "@/utils/request";

export default {
  name: "Repassword",
  data(){
    return{
      form:{},
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      rules:{
        password: [
           { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    this.form.username = this.user.username
  },
  methods:{
    canle(){
      window.history.back()
    },
    logout(){
      this.$router.push("/login")
      localStorage.removeItem("user") // 清除浏览器中的用户信息
      localStorage.removeItem("menus")
      this.$message.success("退出成功！")
    },
    add(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {  //合法
          if (this.form.newPassword !== this.form.rePassword) {
            this.$message.error("2次输入的新密码不相同")
            return false
          }
          this.request.post("/user/password", this.form).then(res => {
            if (res.code === '200') {
              this.$message.success("修改成功")
              this.logout()
            } else {
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>