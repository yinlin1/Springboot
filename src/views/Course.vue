<template>
  <div>
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
    </div>
    <el-table :data="tableData" @selection-change="handleSelectionChange" stripe>
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column prop="name" label="课程名" width="140">
      </el-table-column>
      <el-table-column prop="score" label="课程学分" width="120">
      </el-table-column>
      <el-table-column prop="times" label="课时">
      </el-table-column>
      <el-table-column prop="teacher" label="授课老师">
      </el-table-column>
      <el-table-column label="启用">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ccc" @change="ChangeState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="success" @click="SelectCourse(scope.row.id)">选课<i class="el-icon-edit ml-5"></i></el-button>
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

    <!-- 弹窗 -->
    <el-dialog title="课程信息" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="课程名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="老师" :label-width="formLabelWidth">
          <el-select clearable v-model="form.teacherId" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.username"
                :label="item.username"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学分" :label-width="formLabelWidth">
          <el-input v-model="form.score" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课时" :label-width="formLabelWidth">
          <el-input v-model="form.times" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import {localServer} from "../../public/config";

export default {
  name: "Course",
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
      form:{},
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
      request.get("/course/page",{
        params:{
          PageNum : this.PageNum,
          PageSize : this.PageSize,
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
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
      this.form = {}
      request.get("/user/roles/admin").then(res => {
        this.options = res.data
      })
      this.dialogFormVisible=true
    },
    // 删除用户信息
    del(id){
      console.log(id)
      request.delete("/course",{params:{id:id}}).then(res => {
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
      request.post("/course/ids",ids).then(res => {
        if (res){
          this.$message.success("批量删除成功！")
          this.load()
        }else {
          this.$message.error("批量删除失败!")
        }
      })
    },
    // 启用状态改变
    ChangeState(row){
      request.post("/course/save",row)
    },
    add(){
      request.post("/course/add",this.form).then(res => {
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
      request.get("user/roles/admin").then(res => {
        this.options = res.data
      })
      // this.dialogFormVisible=true
      this.form = row
      this.dialogFormVisible=true
    },
    // 学生选课
    SelectCourse(courseId){
       request.post("/course/addcourse/" + this.user.id +"/" + courseId).then(res => {
         if (res.code === "200"){
            this.$message.success("选课成功")
         }else {
           this.$message.error("选课失败")
         }
       })
    }
  }
}
</script>

<style scoped>

</style>