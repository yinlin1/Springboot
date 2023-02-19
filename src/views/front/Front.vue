<template>
  <div id="app">
<!--    头部-->
    <div style="display: flex;height: 60px;line-height: 60px;border-bottom: 1px solid #ccc">
      <div class="header" style="width: 350px;text-align: center">
        <b><span style="font-size: 28px;color: seagreen;font-style: italic">牛逼汽车管理有限公司</span></b>
      </div>
      <div style="flex: 1">
<!--        导航菜单-->
        <el-menu
            :default-active="activeIndex2"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
          <el-menu-item index="1"><router-link to="/front/home" style="text-decoration: none">首页</router-link></el-menu-item>
          <el-menu-item index="2"><router-link to="/front/article" style="text-decoration: none">文章管理</router-link></el-menu-item>
          <el-menu-item index="3"><router-link to="/front/video" style="text-decoration: none">视频播放</router-link></el-menu-item>
          <el-menu-item v-if="user.role === 'admin'" index="4"><router-link to="/ home" style="text-decoration: none">后台管理</router-link></el-menu-item>
        </el-menu>

      </div>
      <div style="width: 200px;background-color: rgb(84, 92, 100);">
        <div v-if="!user.username" style="text-align: right;padding-right: 30px">
          <el-button type="primary" size="small" autocomplete="off" @click="$router.push('/login')">登录</el-button>
          <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/register')">注册</el-button>
        </div>
        <div v-else>
          <el-dropdown style="width: 200px;cursor: pointer;text-align: right">
            <div style="display: inline-block">
              <img :src="user.avatarUrl" alt="" style="width: 40px;height: 40px;border-radius: 50%;position: relative;top: 10px;right: 5px">
              <span style="color: cadetblue">{{ user.nickname }}</span><i class="el-icon-arrow-down" style="margin-left: 5px;color: white"></i>
            </div>
            <el-dropdown-menu slot="dropdown" style="width: 100px;text-align: center">
              <el-dropdown-item style="font-size: 14px;padding: 5px 0">
                <router-link to="/person" style="color: black;text-decoration: none">个人信息</router-link>
              </el-dropdown-item>
              <el-dropdown-item style="font-size: 14px;padding: 5px 0">
                <router-link  to="/password" style="color: black;text-decoration: none">修改密码</router-link>
              </el-dropdown-item>
              <el-dropdown-item style="font-size: 14px;padding: 5px 0">
                <!-- 退出的的实现-->
                <span style="text-decoration: none" @click="logout">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
<!--    中间地带-->
<!--      <audio src="../../images/yinlin.mp3"
             loop='true'
             autoplay="autoplay"
             ref="MusicPlay"
             hidden
      ></audio>-->
      <router-view></router-view>
    <!-- 背景音乐 -->
<!--    <div class="bjmc" @click="cyinpin()" >
      <img v-if="yinpin" src="../../images/one.jpg" alt="">
      <img v-else src="../../images/three.jpg" alt="">
    </div>-->
    <!--music：当前播放的音乐。 list：播放列表 ：showlrc：是否显示歌词-->

<!--    底部-->
  </div>
</template>

<script>
import aplayer from "vue-aplayer";
import request from "@/utils/request";
export default {
  name: "Front",
  components:{
    aplayer
  },
  data(){
    return {
      user : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {} ,// 拿出浏览器取出的用户信息
      activeIndex : '1',
      activeIndex2 : '2',
      musics: [
        {
          title: "锦鲤抄",
          artist: "银临",
          url: 'http://music.163.com/song/media/outer/url?id=28188434.mp3',
          pic: "http://p2.music.126.net/LBnYDAUED2mD1veBvBnC8g==/5859297464524710.jpg?param=130y130",
          lrc: "[00:00.000] 作词 : 慕清明[00:01.000] 作曲 : 银临[00:02.310]文案：慕清明[00:04.130]和声：银临[00:06.330]编曲/混音：灰原穷[00:08.870]二胡：弹棉花的GG[00:31.110][00:33.250]【银】蝉声陪伴着行云流浪[00:37.370]回忆开始后安静遥望远方[00:41.270]荒草覆没的古井枯塘[00:45.250]匀散一缕过往[00:49.320][00:49.750]【云】晨曦惊扰了陌上新桑[00:53.600]风卷起庭前落花穿过回廊[00:57.600]浓墨追逐着情绪流淌[01:01.640]染我素衣白裳[01:05.610][01:07.540]【银】阳光微凉[01:09.310]【云】琴弦微凉[01:11.270]【合】风声疏狂 人间仓皇[01:15.220]【银】呼吸微凉[01:17.520]【云】心事微凉[01:19.340]【合】流年匆忙 对错何妨[01:23.640][01:24.090]【云】你在尘世中辗转了千百年[01:28.590]却只让我看你最后一眼[01:32.900]【银】火光描摹容颜燃尽了时间[01:36.850]别留我一人 孑然一身[01:41.140]凋零在梦境里面[01:44.820][02:02.050]【银】萤火虫愿将夏夜遗忘[02:05.680]如果终究要挥别这段时光[02:09.790]裙袂不经意沾了荷香[02:13.750]从此坠入尘网[02:17.540][02:18.240]【云】屐齿轻踩着烛焰摇晃[02:22.160]所有喧嚣沉默都描在画上[02:26.220]从惊蛰一路走到霜降[02:30.510]泪水凝成诗行[02:34.170][02:36.080]【云】灯花微凉[02:37.940]【银】笔锋微凉[02:39.820]【合】难绘虚妄 难解惆怅[02:43.750]【云】梦境微凉[02:46.350]【银】情节微凉[02:48.220]【合】迷离幻象 重叠忧伤[02:52.120][02:52.400]原来诀别是因为深藏眷恋[02:56.960]你用轮回换我枕边月圆[03:01.170]我愿记忆停止在枯瘦指尖[03:05.210]随繁花褪色 尘埃散落[03:09.460]渐渐地渐渐搁浅[03:13.230][03:14.060]【云】多年之后 我又梦到那天[03:21.410]【银】画面遥远 恍惚细雨绵绵[03:29.780][03:30.100]【合】如果来生太远寄不到诺言[03:34.000]不如学着放下许多执念[03:38.230]以这断句残篇向岁月吊唁[03:42.290]老去的当年 水色天边[03:46.530]有谁将悲欢收殓[03:50.210][03:50.590]【云】蝉声陪伴着行云流浪[03:54.780]回忆的远方[03:59.000]",
        },
        {
          title: "棠梨煎雪",
          artist: "银临",
          url: "http://music.163.com/song/media/outer/url?id=28188427.mp3",
          pic: "http://p1.music.126.net/LBnYDAUED2mD1veBvBnC8g==/5859297464524710.jpg?param=130y130",
          lrc: "[00:00.000] 作词 : 商连[00:01.000] 作曲 : 灰原穷[00:26.240]青鲤来时遥闻春溪声声碎[00:31.420]嗅得手植棠梨初发轻黄蕊[00:36.760]待小暑悄过 新梨渐垂[00:41.970]来邀东邻女伴撷果缓缓归[00:47.550][00:49.550]旧岁采得枝头细雪[00:55.230]今朝飘落胭脂梨叶[01:00.440]轻挼草色二三入卷[01:05.700]细呷春酒淡始觉甜[01:10.460][01:11.670]依旧是[01:13.520]偏爱枕惊鸿二字入梦的时节[01:18.870]烛火惺忪却可与她漫聊彻夜[01:24.070]早春暮春 酒暖花深[01:29.430]便好似一生心事只得一人来解[01:34.510][01:34.810]岁岁花藻檐下共将棠梨煎雪[01:39.860]自总角至你我某日辗转天边[01:45.080]天淡天青 宿雨沾襟[01:50.430]一年一会信笺却只见寥寥数言[01:55.550][02:19.240]旧岁采得枝头细雪[02:24.700]今朝飘落胭脂梨叶[02:30.000]轻挼草色二三入卷[02:35.200]细呷春酒淡始觉甜[02:39.750][02:41.140]依旧是[02:43.270]偏爱枕惊鸿二字入梦的时节[02:48.470]烛火惺忪却可与她漫聊彻夜[02:53.650]早春暮春 酒暖花深[02:58.920]便好似一生心事只得一人来解[03:04.080][03:04.300]岁岁花藻檐下共将棠梨煎雪[03:09.290]自总角至你我某日辗转天边[03:14.680]天淡天青 宿雨沾襟[03:19.900]一年一会信笺却只见寥寥数言[03:25.110][03:30.200]雨中灯市欲眠 原已萧萧数年[03:36.130]似有故人轻叩 再将棠梨煎雪[03:42.040]能否消得[03:44.830]你一路而来的半生风雪[03:53.220]"
        },
      ],
    }
  },
  created() {

  },
  methods:{
    logout(){
      this.$router.push("/login")
      localStorage.removeItem("user") // 清除浏览器中的用户信息
      localStorage.removeItem("menus")
      this.$message.success("退出成功！")
    },
  }
}
</script>

<style scoped>
#app {
  background: url("../../images/four.jpg") !important;
  overflow-x: hidden;
  min-width: 320px;
}
.header{
  width: 100%;
  display: block;
  background-color: rgb(84, 92, 100);
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 800px;
  margin: 0;
}
</style>