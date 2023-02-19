<template>
  <div class="center">
    <div style="padding: 10px 0;border-bottom: 1px dashed #8c939d">
      <div class="pd-10" style="font-size: 20px;color: #475669;cursor: pointer"><b><i>{{tableData.name}}</i></b></div>
      <div style="font-size: 12px; margin-top: 10px">
        <i class="el-icon-user-solid"></i><span>{{tableData.user}}</span>
        <i class="el-icon-time" style="margin-left: 10px"></i><span>{{tableData.time}}</span>
      </div>
    </div>
<!--    内容展示-->
    <div style="margin-bottom: 20px">
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
<!--    评论-->
    <div style="margin-bottom: 20px">
      <div style="font-size: 20px">评论</div>
      <div style="padding: 10px 0">
        <el-input size="small" type="textarea" v-model="usercomment.content" placeholder="请输入评论内容..."></el-input>
      </div>
      <div style="padding: 10px 0;text-align: right">
        <el-button type="primary" @click="fatherComment">评论</el-button>
      </div>
    </div>
<!--    评论列表-->
    <div style="padding-bottom: 25px">
      <div v-for="item in comments" :key="item.id" style="border-bottom: 1px solid #666666;padding: 10px 0;display: flex" v-if="item.originId === null">
        <div style="width: 100px;text-align: center">
          <el-image :src="item.avatarUrl" style="width: 50px;height: 50px;border-radius: 50%"></el-image>
        </div>
        <div style="flex: 1;font-size: 14px;padding: 5px 0;line-height: 25px">
          <b>{{item.nickname}}：</b>
          <span>{{item.content}}</span>
          <div style="display: flex;line-height: 20px;margin-top: 5px">
            <div style="width: 200px">
              <i class="el-icon-time"><span style="margin-left: 5px">{{item.time}}</span></i>
            </div>
            <div style="text-align: right;flex: 1">
              <el-button style="margin-left: 5px" type="text" @click="replay(item.originId,item.id)">回复</el-button>
              <el-button style="color: red" type="text" v-if="user.id === item.userId" @click="delComment(item.id)">删除</el-button>
            </div>
          </div>
          <!--      子评论-->
          <div  style="padding-left: 200px">
            <div v-for="subItem in item.children" :key="subItem.id" style="background-color: #f0f0f0;padding: 5px 20px;">
              <!--             回复列表-->
              <div style="font-size: 14px;padding: 5px 0;line-height: 25px">
                <div>
                  <b style="color: #3a8ee6">@{{subItem.pnickname}}</b>
                </div>
                <div style="padding-left: 5px;line-height: 25px">
                  <b><el-image :src="subItem.avatarUrl" style="width: 25px;height: 25px;border-radius: 50%;margin-top: 10px"></el-image>{{subItem.nickname}}:</b>
                  <span>{{subItem.content}}</span>
                </div>

                <div style="display: flex;line-height: 20px;margin-top: 5px;padding-left: 5px">
                  <div style="width: 200px">
                    <i class="el-icon-time"></i><span style="margin-left: 5px">{{subItem.time}}</span>
                  </div>
                  <div style="text-align: right;flex: 1">
                    <el-button style="margin-left: 5px" type="text" @click="replay(subItem.originId,subItem.id)">回复</el-button>
                    <el-button style="color: red" type="text" v-if="user.id === subItem.userId" @click="delComment(subItem.id)">删除</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

<!--    回复弹窗-->
    <el-dialog :visible.sync="vis" width="60%">
      <el-input size="small" type="textarea" v-model="usercomment.sonContent" placeholder="请输入评论内容..."></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="vis = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import request from "@/utils/request";

export default {
  name: "FrontArticleDetail",
  data(){
    return{
      tableData:[],
      content:'',
      usercomment:{},
      comments:[],
      user : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {} ,
      id:this.$route.query.id,
      vis:false,
    }
  },
  created() {
    this.load()
    this.lodeComments()
  },
  methods: {
    load() {
      request.get("/article/artid/"+ this.id).then(res => {
        this.tableData = res.data
         // console.log(res)
        this.content = res.data.content
      })
    },
    lodeComments(){
      request.get("/comment/articleid",{
        params:{
          articleId:this.id
        }
      }).then(res => {
        this.comments = res.data
        console.log(res)
      })
    },
    fatherComment(){
      if (!this.user.id){
        this.$message.warning("请登录后评论！")
        return
      }
      this.usercomment.userId = this.user.id
      this.usercomment.articleId = this.id
      this.usercomment.avatarUrl = this.user.avatarUrl
      this.usercomment.nickname = this.user.nickname
      request.post("/comment/addcomment",this.usercomment).then(res =>{
        this.lodeComments()
      })
    },
    // 删除评论
    delComment(id){
      request.delete("/comment/delcomment",{
        params:{
          articleId:id
        }
      }).then(res =>{
        if ('200' === res.code){
          this.lodeComments()
          this.$message.success("删除成功!")
        }else {
          this.$message.error("删除失败！")
        }
      })
    },
    // 回复评论
    replay(originId,id){
      if (!this.user.id){
        this.$message.warning("请登录后评论！")
        return
      }
      this.vis = true
      this.usercomment.userId = this.user.id
      this.usercomment.articleId = this.id
      this.usercomment.avatarUrl = this.user.avatarUrl
      this.usercomment.nickname = this.user.nickname
      if (!originId){
        this.usercomment.pid = id
        this.usercomment.originId = id
      }else {
        this.usercomment.pid = id
        this.usercomment.originId = originId
      }
    },
    add(){
      this.usercomment.content = this.usercomment.sonContent
      request.post("/comment/addcomment",this.usercomment).then(res =>{
        this.lodeComments()
        this.usercomment = {}
        this.vis = false
      })
    }
  },
}
</script>

<style scoped>
.center{
  padding-top: 50px;
  margin: 0 auto;
  width: 1200px;
}
</style>