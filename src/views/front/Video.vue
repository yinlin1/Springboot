<template>
  <div style="padding: 10px">
    <div class="center">
      <el-card>
        <div v-for="item in videos" :key="item.id" style="margin: 10px 0;padding: 10px 0; color: #666;border-bottom: 1px dashed #ccc">
          <span class="item" style="font-size: 18px; cursor: pointer" @click="input(item.id)">{{ item.name }}</span>
          <span style="float: right; font-size: 12px; margin-top: 10px">文件大小(KB):{{ item.size }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Video,vue",
  data(){
    return{
      videos:[],

    }
  },
  created() {
    request.get("/file/fileall").then(res => {
      this.videos = res.data.filter(v => v.type === 'mp4')
    })
  },
  methods:{
    input(id){
      this.$router.push({path:"/front/videodetail",query:{id : id}})
    }
  },
}
</script>

<style scoped>
.item:hover{
  color: #409EFF;
  background: none;
}
.center{
  padding-top: 50px;
  margin: 0 auto;
  width: 1200px;
}
</style>