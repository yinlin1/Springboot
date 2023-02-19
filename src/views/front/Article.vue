<template>
  <div class="center">
      <div style="padding: 10px 0">
      <el-input style="width: 300px" v-model='name' placeholder="请输入文章名..." suffix-icon="el-icon-search"></el-input>
      <el-button class="ml-5" style="width: 50px" type="primary" @click="load" size="small">搜索</el-button>
      <el-button class="ml-5" style="width: 50px" type="warning" @click="reset" size="small">重置</el-button>
    </div>
    <div style="margin: 10px 0">
      <div style="padding: 10px 0;border-bottom: 1px dashed #8c939d" v-for="item in tableData" :key="item.id">
        <div class="pd-10" style="font-size: 20px;color: #475669;cursor: pointer" @click="$router.push('/front/articledetail?id='+item.id)"><b><i>{{item.name}}</i></b></div>
        <div style="font-size: 12px; margin-top: 10px">
          <i class="el-icon-user-solid"></i><span>{{item.user}}</span>
          <i class="el-icon-time" style="margin-left: 10px"></i><span>{{item.time}}</span>
        </div>
      </div>
    </div>
    <!-- 分页查询 -->
    <div style="padding: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="PageNum"
          :page-sizes="[2, 5, 15, 20]"
          :page-size="PageSize"
          layout="total, prev, pager, next"
          :total="total">
      </el-pagination>
    </div>
    <!--    文章查看弹窗实现-->
    <el-dialog title="文章信息" :visible.sync="articleVisible">
      <el-card>
        <div>
          <mavon-editor
              class="md"
              :value="content"
              :subfield="false"
              defaultOpen="preview"
              :toolbarsFlag="false"
              :editable="false"
              :scrollStyle="true"
              :ishljs="true">
          </mavon-editor>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import {localServer} from "../../../public/config";
import axios from "axios";

export default {
  name: "FrontArticle",
  data(){
    return{
      // 定义展示页面数据的空数组
      localServer : localServer,
      tableData: [],
      total:0,
      // 分页数据的动态生成
      PageNum:1,
      PageSize:10,
      // 页面模糊查询参数
      name:"",
      collapseBtnClass: "el-icon-s-fold",
      isCollapse: false,
      sideWidth: 200,
      // 自定义导航栏字体的显示
      logoTestShow:true,
      // 添加用户操作弹窗
      dialogFormVisible: false,
      articleVisible : false,
      formLabelWidth: "120px",
      form:{},
      content: "",
      oldfrom:{},
      // 多选框数组
      multipleSelection:[],
      // 下拉框
      options:[],
      user : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
    }
  },
  created() {
    this.load()
  },
  methods:{
    load(){
      request.get("/article/page",{
        params:{
          name : this.name,
          PageNum : this.PageNum,
          PageSize : this.PageSize,
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        console.log(res)
      })
    },
    reset(){
      this.name = ''
      this.load()
    },
    handleSizeChange(PageSize){
      this.PageSize = PageSize
      this.load()
    },
    handleCurrentChange(PageNum){
      this.PageNum = PageNum
      this.load()
    },
    // 添加弹窗打开功能
    handadd(){
      this.form = {}
      this.dialogFormVisible=true
    },
  }
}
</script>

<style scoped>
.center{
  padding-top: 50px;
  margin: 0 auto;
  width: 1200px;
}
</style>