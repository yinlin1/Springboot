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
      <el-upload :action="'http://'+localServer+':9090/role/import'" :on-success="FileImpSuccess" :accept="xlsx" style="display: inline-block">
        <el-button class="ml-5" type="warning" @click="imp">导入<i class="el-icon-download ml-5"></i></el-button>
      </el-upload>
      <el-button class="ml-5" type="warning" @click="expt">导出<i class="el-icon-upload2 ml-5"></i></el-button>
    </div>
    <el-table :data="tableData" @selection-change="handleSelectionChange" stripe>
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="description" label="描述">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row)">编辑<i class="el-icon-edit ml-5"></i></el-button>
          <el-button type="info" @click="MuneVisTrue(scope.row.id)">分配菜单<i class="el-icon-menu ml-5"></i></el-button>
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
    <!-- 添加角色弹窗 -->
    <el-dialog title="角色信息" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加菜单弹窗-->
    <el-dialog title="菜单添加" :visible.sync="dialogFormVisibleMenu" width="30%">
      <el-tree
          :props="props"
          :data="TreeData"
          node-key="id"
          ref="tree"
          show-checkbox
          @check-change="handleCheckChange"
          :default-checked-keys="checks"
          :default-expanded-keys="expends">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span><i :class="data.icon" /></span> {{ data.name }}
              </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleMenu = false">取 消</el-button>
        <el-button type="primary" @click="roleMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import {localServer} from "../../public/config";

export default {
  name: "Role",
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
      collapseBtnClass: "el-icon-s-fold",
      isCollapse: false,
      sideWidth: 200,
      // 自定义导航栏字体的显示
      logoTestShow:true,
      // 添加用户操作弹窗
      dialogFormVisible: false,
      formLabelWidth: "120px",
      // 树状弹窗参数赋值
      props: {
        label: 'name'
      },
      expends:[],
      checks:[],
      dialogFormVisibleMenu:false,
      TreeData: [],
      roleId : 0,

      form:{name:'',description:''},
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
      request.get("/role/page",{
        params:{
          PageNum : this.PageNum,
          PageSize : this.PageSize,
          name : this.name,
        }
      }).then(res => {
        this.tableData = res.records
        this.total = res.total
        // console.log(res)
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
    },
    // 用户添加和修改功能
    add(){
      request.post("/role/add",this.form).then(res => {
        if (res){
          this.$message.success("保存成功")
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
    },
    // 删除用户信息
    del(id){
      // console.log(id)
      request.delete("/role",{params:{id:id}}).then(res => {
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
      // console.log(ids)
      request.post("/role/ids",ids).then(res => {
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
      window.open(`http://${localServer}:9090/role/export`)
    },
    // 文件导入成功提示
    FileImpSuccess(){
      this.$message.success("文件导入成功！")
      this.load()
    },
    // 树形弹窗方法设置
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate);
    },
    MuneVisTrue(roleId){
      // console.log(rowId)
      request.get("/menu/find").then(res => {
        this.TreeData = res.data
        this.expends = this.TreeData.map(v => v.id) // 处理成ID数组
      })
      request.get("/role/menutrue/" + roleId).then(res => {
        this.$refs.tree.setCheckedKeys(res.data.map(v => v.menuid))
      })
      this.roleId = roleId
      this.dialogFormVisibleMenu = true
    },
    // 新增角色菜单功能
    roleMenu(){
      request.post("/role/rolemenu/" + this.roleId,this.$refs.tree.getCheckedKeys())
        this.dialogFormVisibleMenu = false
    },
    // 查询角色与菜单绑定默认选中

  }
}
</script>

<style scoped>

</style>