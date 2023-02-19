<template slot-scope="scope">
  <div style="height: 100%">
    <el-container style="height: 100%; border: 1px solid #eee">
      <!-- 侧边栏 -->
      <el-aside :width="sideWidth + 'px'" style="background-color: rgb(238, 241, 246);height: 100%;">
        <Aside :isCollapse="isCollapse" :logoTestShow="logoTestShow"></Aside>
      </el-aside>
      <!-- 头部 -->
      <el-container>
        <el-header style="border-bottom: 1px solid #ccc">
          <Header :collapseBtnClass="collapseBtnClass" :collapse="collapse"></Header>
        </el-header>
        <!-- 主题部分 -->
        <el-main>
        <!-- 子路由在 router-view 中显示-->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import request from "@/utils/request";
// 导入路由
import Aside from "@/components/Aside";
import Header from "@/components/Header";
export default {
  name: 'HomeView',
  components: {
    Aside,
    Header
  },
  data(){
    return {
      // 定义展示页面数据的空数组
      tableData: [],
      total:0,
      // 分页数据的动态生成
      PageNum:1,
      PageSize:2,
      // 页面模糊查询参数
      username:"",
      email:"",
      address:"",
      collapseBtnClass: "el-icon-s-fold",
      isCollapse: false,
      sideWidth: 200,
      // 自定义导航栏字体的显示
      logoTestShow:true,
      // 添加用户操作弹窗
      dialogFormVisible: false,
      formLabelWidth: "120px",
      form:{username:'',nickname:'',address:'',phone:'',email:'',password:''},
      // 多选框数组
      multipleSelection:[],
    }
  },
  created() {
  },
  methods:{
    // 点击收缩按钮触发此函数,收缩属性取反
    collapse(){
      this.isCollapse = !this.isCollapse
      if (this.isCollapse === true){
        this.sideWidth = 64
        this.collapseBtnClass = "el-icon-s-unfold"
        this.logoTestShow = false
      }else {
        this.sideWidth = 200
        this.logoTestShow = true
      }
    },
  }
}
</script>
