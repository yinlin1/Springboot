<template>
  <div>
    <div style="padding: 10px 0">
      <el-upload :action="'http://' +localServer+ ':9090/file/upload'" :on-success="FileImpSuccess" style="display: inline-block">
        <el-button type="primary" @click="handadd">文件上传<i class="el-icon-circle-plus-outline ml-5"></i></el-button>
      </el-upload>
      <el-popconfirm
          class="ml-5"
          confirm-button-text='好的'
          cancel-button-text='不用了'
          icon="el-icon-info"
          icon-color="red"
          title="您确定删除吗？"
          @confirm="beachdel">
        <el-button slot="reference" type="danger">批量删除<i class="el-icon-delete ml-5"></i></el-button>
      </el-popconfirm>
    </div>
    <el-table :data="tableData" @selection-change="handleSelectionChange" stripe>
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column prop="name" label="文件名" width="140">
      </el-table-column>
      <el-table-column prop="type" label="文件类型" width="120">
      </el-table-column>
      <el-table-column prop="size" label="文件大小">
      </el-table-column>
      <el-table-column prop="url" label="文件链接">
      </el-table-column>
      <el-table-column label="启用">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ccc" @change="ChangeState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="download(scope.row.url)">下载<i class="el-icon-edit ml-5"></i></el-button>
          <el-popconfirm
              class="ml-5"
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              @confirm="del(scope.row.id)">
            <el-button slot="reference" type="danger">删除<i class="el-icon-delete ml-5"></i></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页查询 -->
    <div style="padding: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="PageNum"
          :page-sizes="[2, 5, 15, 20]"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import {localServer} from "../../public/config";

export default {
  name: "File",
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
    this.load()
  },
  methods:{
    load(){
      // 请求分页拿数据 与XMLHttpRequest(XHR)类似，fetch()方法允许你发出AJAX请求。区别在于Fetch API使用Promise，因此是一种简洁明了的API，比XMLHttpRequest更加简单易用。
      /*      fetch("http://localhost:9090/user/page?PageNum="+this.PageNum+"&PageSize="+this.PageSize).then(res => res.json()).then(res =>{
              this.tableData = res.records
              this.total = res.total
              console.log(res)
            })*/

      // 利用 axios 执行 request 请求
      request.get("/file/page",{
        params:{
          PageNum : this.PageNum,
          PageSize : this.PageSize,
        }
      }).then(res => {
        this.tableData = res.records
        this.total = res.total
        console.log(res)
      })
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
      request.post("/file/upload")
    },
    // 删除用户信息
    del(id){
      console.log(id)
      request.delete("/file",{params:{id:id}}).then(res => {
        if (res){
          this.$message.success("删除用户信息成功！")
          this.load()
        }else {
          this.$message.error("删除用户信息失败！")
        }
      })
    },
    // 复选框改变触发事件
    handleSelectionChange(val){
      this.multipleSelection=val
    },
    // 批量删除触发事件
    beachdel(){
      let ids = this.multipleSelection.map(v => v.id) // 仙术妈的让[{},{},{}]转换为[1,2,3]
      console.log(ids)
      request.post("/file/ids",ids).then(res => {
        if (res){
          this.$message.success("批量删除成功！")
          this.load()
        }else {
          this.$message.error("批量删除失败!")
        }
      })
    },
    // 文件下载功能
    download(url){
      window.open(url)
    },
    // 启用状态改变
    ChangeState(row){
      request.post("/file/save",row)
    },
    // 文件上传成功提示
    FileImpSuccess(){
      this.$message.success("文件上传成功")
      this.load()
    }
  }
}
</script>

<style scoped>

</style>