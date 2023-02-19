<template xmlns:text-decoration="http://www.w3.org/1999/xhtml" xmlns:cursor="http://www.w3.org/1999/xhtml">
    <el-card style="width: 600px;padding: 20px;border: 1px solid #ccc">
      <el-form label-width="80px" size="small">
        <el-upload
            class="avatar-uploader"
            :action="'http://'+localServer+':9090/file/upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
          <img style="padding-bottom: 20px" v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div style="padding-bottom: 20px;margin-left: 30px">
          <span style="color: #fc5531;">账户余额 </span><span style="margin-right: 85px;">{{form.money}}￥</span>
          <a href="https://pay.weixin.qq.com/static/product/product_index.shtml" target="_blank" style="color: #fff;
                background: #fc5531;
                display: inline-block;
                width: 72px;
                height: 28px;
                line-height: 28px;
                text-align: center;
                border-radius: 15px;
                font-size: 14px;text-decoration: none;cursor: pointer">去充值
          </a>
        </div>
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">确 定</el-button>
          <el-button type="primary" @click="canle">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
</template>
<script>


import {localServer} from "../../public/config";

export default {
  name: "Person",
  data(){
    return {
      localServer:localServer,
      form: {},
      user : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  created() {
    // console.log(this.user)
    // console.log(this.user.username)
    this.getUser().then(res => {
      this.form = res
    })
    },
  methods:{
    async getUser(){
      return await (this.request.get("/user/username/" + this.user.id ))
    },
    add() {
      // console.log(this.form)
      // this.user = this.form
      this.request.post("/user/add",this.form).then(res => {
        if (res) {
          this.$message.success("保存成功")
          this.getUser().then(res => {
            res.token = JSON.parse(localStorage.getItem("user")).token
            //console.log(res.token)
            localStorage.setItem("user",JSON.stringify(res))
            // console.log(res.token)
            // console.log("111111111111111111111111111111111")
            // console.log(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {})
          })
          this.$router.push("/user")
          this.dialogFormVisible = false
          this.load()
        } else {
          this.$message.error("保存失败")
        }
      })
    },
    // 照片上传成功输出方法
    handleAvatarSuccess(res){
      this.form.avatarUrl = res
    },
    canle(){
      window.history.back()
    }
  }
}
</script>

<style scoped>
  .avatar-uploader{
    text-align: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 158px;
    height: 158px;
    display: block;
  }
</style>