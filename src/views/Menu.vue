<template>
  <div>
    <!-- 搜索框的配置 -->
    <div style="padding: 10px 0">
      <el-input style="width: 200px" v-model='name' placeholder="请输入名称" suffix-icon="el-icon-search"></el-input>
      <el-button class="ml-5" style="width: 50px" type="primary" @click="load">搜索</el-button>
      <el-button class="ml-5" style="width: 50px" type="warning" @click="reset">重置</el-button>
    </div>
    <div style="padding: 10px 0">
      <el-button type="primary" @click="handadd">新增<i class="el-icon-circle-plus-outline ml-5"></i></el-button>
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
      <!-- 导入操作所需地址 -->
      <el-upload :action="'http://'+localServer+':9090/menu/import'" :on-success="FileImpSuccess" :accept="xlsx" style="display: inline-block">
        <el-button class="ml-5" type="warning" @click="imp">导入<i class="el-icon-download ml-5"></i></el-button>
      </el-upload>
      <el-button class="ml-5" type="warning" @click="expt">导出<i class="el-icon-upload2 ml-5"></i></el-button>
    </div>
    <el-table :data="tableData" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @selection-change="handleSelectionChange" stripe>
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column prop="name" label="菜单名">
      </el-table-column>
      <el-table-column prop="path" label="路径">
      </el-table-column>
      <el-table-column prop="pagePath" label="页面路径">
      </el-table-column>
      <el-table-column label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述">
      </el-table-column>
      <el-table-column label="操作" width="380px">
        <template slot-scope="scope">
          <el-button type="primary" @click="sonMenu(scope.row.id)" v-if="!scope.row.pid && !scope.row.path">新增子菜单<i class="el-icon-edit ml-5"></i></el-button>
          <el-button type="primary" @click="edit(scope.row)">编辑<i class="el-icon-edit ml-5"></i></el-button>
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
    <!-- 弹窗 -->
    <el-dialog title="菜单信息" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="菜单名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路径" :label-width="formLabelWidth">
          <el-input v-model="form.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="页面路径" :label-width="formLabelWidth">
          <el-input v-model="form.pagePath" autocomplete="off"></el-input>
        </el-form-item>
<!--        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="form.icon" autocomplete="off"></el-input>
        </el-form-item>-->
        <el-form-item label="图标" :label-width="formLabelWidth">
            <el-select clearable v-model="form.icon" placeholder="请选择">
              <el-option
                  v-for="item in options"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value">
                <span><i :class="item.value" /> {{ item.name }}</span>
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canclevis">取消</el-button>
        <el-button type="primary" @click="add">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import {localServer} from "../../public/config";

export default {
  name: "Menu",
  data(){
    return{
      localServer:localServer,
      // 定义展示页面数据的空数组
      tableData: [],
      total:0,
      // 分页数据的动态生成
      PageNum:1,
      PageSize:10,
      // 页面模糊查询参数
      name:"",
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
      form:{name:'',path:'',icon:'',description:'',pid:''},
      // 多选框数组
      multipleSelection:[],
      // 选择图标下拉框的参数赋值
      options:[]
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
      request.get("/menu/find",{
        params:{
          name : this.name
        }
      }).then(res => {
        this.tableData = res.data
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
    // 重置功能
    reset(){
      this.name=""
      this.load()
    },
    // 添加弹窗打开功能
    handadd(){
      this.dialogFormVisible=true
      this.dictFind()
    },
    // 用户添加和修改功能
    add(){
      request.post("/menu/add",this.form).then(res => {
        if (res){
          this.$message.success("保存成功")
          this.form = {name:'',path:'',icon:'',description:'',pid:''}
          this.dialogFormVisible=false
          this.load()
        }else {
          this.$message.error("保存失败")
        }
      })
    },
    // 修改用户信息
    edit(row){
      // this.dialogFormVisible=true
      this.form = row
      this.dialogFormVisible=true
      this.dictFind()
    },
    // 删除用户信息
    del(id){
      console.log(id)
      request.delete("/menu",{params:{id:id}}).then(res => {
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
      request.post("/menu/ids",ids).then(res => {
        if (res){
          this.$message.success("批量删除成功！")
          this.load()
        }else {
          this.$message.error("批量删除失败!")
        }
      })
    },
    // 用户导出功能
    expt(){
      window.open(`http://${localServer}:9090/menu/export`)
    },
    // 文件导入成功提示
    FileImpSuccess(){
      this.$message.success("文件导入成功！")
      this.load()
    },
    // 新增子菜单
    sonMenu(pid){
      if (pid){
        this.dialogFormVisible = true
        this.form.pid = pid;
      }
      this.load()
    },
    // 查询字典方法
    dictFind(){
      request.get("/menu/icon").then(res => {
        this.options = res.data
      })
    },
    // 取消弹窗
    canclevis(){
      this.dialogFormVisible = false
      this.form = {}
    }
  }
}
</script>

<style scoped>

</style>