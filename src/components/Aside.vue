<template>
  <el-menu :default-openeds="['1', '3']" style="min-height: 100%;overflow: hidden" background-color="rgb(48,65,86)" text-color="#fff"
           active-text-color="#ffd04b"
           :collapse-transition="false"
           :collapse	="isCollapse"
           router
           @select="handleSelect"
            >
    <!-- router 选项的跳转(重定向)-->
    <!-- collapse-transition 设置是否展开动画 collapse 设置展开状态,flase 折叠 true 为展开-->
    <!-- 页面标题 -->
    <div style="height: 60px;text-align: center;line-height: 60px">
      <!-- 菜单栏的自定义显示 -->
      <img src="../assets/logo.png" alt="" height="20px" style="top: 5px;margin-right: 5px;position: relative">
      <b style="color: white" v-show="logoTestShow">后台管理系统</b></div>
    <!-- 一级菜单 -->
    <div v-for="item in menus" :key="item.id">
      <div v-if="item.path">
        <el-menu-item :index="item.path"><i :class="item.icon"></i><span slot="title">{{ item.name }}</span></el-menu-item>
      </div>
      <!-- 二级菜单 -->
      <div v-else>
        <el-submenu :index="item.id">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </template>
          <div v-for="child in item.children" :key="child.id">
            <el-menu-item :index="child.path">
              <i :class="child.icon"></i>
              <span slot="title">{{ child.name }}</span>
            </el-menu-item>
          </div>
        </el-submenu>
      </div>
    </div>
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  props: {
    isCollapse: Boolean,
    logoTestShow:Boolean,
  },
  data(){
    return{
      menus : [],
    }
  },
  created() {
    this.menus = JSON.parse(localStorage.getItem("user")).menus

  },
  methods:{
    handleSelect(){
      console.log(index)
      console.log(this.$router.options.routes)
    }
  }
}
</script>

<style scoped>

</style>