<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 40px">
      <el-col :span="6">
        <el-card style="color: #409EFF">
          <div>用户总数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">
            1000
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #E6A23C">
          <div>门店总数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">
            10
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #F56C6C">
          <div>销售总量</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">
            10000000
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #67C23A">
          <div>收益总数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold">
            5000000
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div id="main" style="width: 500px;height: 400px"></div>
      </el-col>
      <el-col :span="12">
        <div id="pie" style="width: 500px;height: 400px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import * as echarts from 'echarts';
import request from "@/utils/request";
export default {
  name: "Home.vue",
  data(){
    return{

    }
  },
  mounted() {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;
    request.get("/echarts/member").then(res =>{
      // option.xAxis.data = res.data.x
      option.series[0].data = res.data
      option.series[1].data = res.data
      myChart.setOption(option);
    })
    option = {
      title: {
        text: '各季度会员注册登记表',
        subtext: '趋势图',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: ['第一季度','第二季度','第三季度','第四季度']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [],
          type: 'line'
        },
        {
          data: [],
          type: 'bar'
        },
      ]
    };
    // 饼图
    var chartDomPie = document.getElementById('pie');
    var myChartPie = echarts.init(chartDomPie);
    var optionPie;
    request.get("/echarts/member").then(res =>{
      optionPie.series[0].data = [ {value:res.data[0],name:'第一季度'},
                                {value:res.data[1],name:'第二季度'},
                                {value:res.data[2],name:'第三季度'},
                                {value:res.data[3],name:'第四季度'},]
      myChartPie.setOption(optionPie);
    })
    optionPie = {
      title: {
        text: '各季度会员注册登记表',
        subtext: '饼图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '60%',
          itemStyle : {
            normal : {
              label:{            //饼图图形上的文本标签
                show:true,
                position:'inner', //标签的位置
                textStyle : {
                  fontWeight : 300 ,
                  fontSize : 14    //文字的字体大小
                },
                formatter:'{d}%'
              },
              labelLine : {
                show : true   //隐藏标示线
              }
            }
          },
          data: [
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    myChartPie.setOption(optionPie)
  },
}
</script>

<style scoped>

</style>