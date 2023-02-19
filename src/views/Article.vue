<template>
  <div>
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
    </div>
    <el-table :data="tableData" @selection-change="handleSelectionChange" stripe>
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column prop="name" label="文章标题" width="140">
      </el-table-column>
      <el-table-column prop="content" label="文章内容" width="120">
        <template slot-scope="scope">
          <el-button @click="view(scope.row.content)" type="primary">查看文章</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="user" label="发布人">
      </el-table-column>
      <el-table-column prop="time" label="发布时间">
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
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
    <el-dialog title="发布文章" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <mavon-editor ref=md v-model="form.content" ishljs="true" @imgAdd="imgAdd" ></mavon-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
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
import {localServer} from "../../public/config";
import axios from "axios";

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
    // 删除用户信息
    del(id){
      console.log(id)
      request.delete("/article",{params:{id:id}}).then(res => {
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
      request.post("/article/ids",ids).then(res => {
        if (res){
          this.$message.success("批量删除成功！")
          this.load()
        }else {
          this.$message.error("批量删除失败!")
        }
      })
    },
    add(){
      this.form.user = this.user.username
      request.post("/article/add",this.form).then(res => {
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
    // 取消修改
    cancle(){
      this.load()
      this.dialogFormVisible=false
    },
    // Markdown传递图片
    // 绑定@imgAdd event
      imgAdd(pos, $file){
      let $vm = this.$refs.md
      // 第一步.将图片上传到服务器.
      const formdata = new FormData();
      formdata.append('file', $file);
      axios({
        url: "http://"+localServer+":9090/file/upload",
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((res) => {
        console.log(res)
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        /**
         * $vm 指为mavonEditor实例，可以通过如下两种方式获取
         * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
         * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
         */
        $vm.$img2Url(pos, res.data);
      })
    },
    // 文章查看
    view(content){
      this.content = content
      this.articleVisible = true
    }
  }
}
</script>

<style scoped>

</style>