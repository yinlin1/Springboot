<template>
  <div style="font-size: 12px;line-height: 61px;display: flex">
    <!-- 设置收缩页面 -->
    <div style="flex: 1;font-size: 20px">
      <span :class="collapseBtnClass" style="cursor: pointer" @click="collapse"></span>

      <el-breadcrumb separator="/" style="display: inline-block; margin-left: 10px">
        <el-breadcrumb-item :to="{path:'/'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPathName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-dropdown style="width: 200px;cursor: pointer;text-align: right">
      <div style="display: inline-block">
        <img :src="user.avatarUrl" alt="" style="width: 30px;border-radius: 50%;position: relative;top: 10px;right: 5px">
        <span>{{ user.nickname }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      </div>
      <el-dropdown-menu slot="dropdown" style="width: 100px;text-align: center">
        <el-dropdown-item style="font-size: 14px;padding: 5px 0">
          <router-link to="/person" style="color: black;text-decoration: none">个人信息</router-link>
        </el-dropdown-item>
        <el-dropdown-item style="font-size: 14px;padding: 5px 0">
          <router-link  to="/password" style="color: black;text-decoration: none">修改密码</router-link>
        </el-dropdown-item>
        <el-dropdown-item style="font-size: 14px;padding: 5px 0">
          <!-- 退出的的实现-->
          <span style="text-decoration: none" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "Header",
  props:{
    collapseBtnClass:String,
    collapse:Function
  },
  data(){
    return{
      // currentPathName:''
      user : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {} ,// 拿出浏览器取出的用户信息
      users : localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : {}
    }
  },
  computed:{
    currentPathName() {
      return this.$store.state.currentPathName // 需要监听的数据
    }
  },
  watch: { // 监听路由变化
    currentPathName (newVal,oldVal){
      console.log(newVal)
    }
  },
  methods : {
    logout(){
      this.$router.push("/login")
      localStorage.removeItem("user") // 清除浏览器中的用户信息
      localStorage.removeItem("menus")
      this.$message.success("退出成功！")
    },
  }
}
</script>

<style scoped>

</style>