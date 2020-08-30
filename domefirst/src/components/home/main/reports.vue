<template>
  <el-card>
    <!-- //面包屑 -->
    <my-breat title1="数据统计" title2="数据报表"></my-breat>
     <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script>
var echarts = require('echarts')
export default {
    name:'reports',
    data() {
        return{
            options:{}
        }
    },
    //因为Echarts插件需要一个div来包裹才能显示
    //如果在created钩子调用会得不到表格
    //mounted钩子时已经存在div和数据
    mounted() {
        this.getEcharts()
    },
    methods:{
        async getEcharts() {
            const res = await this.axios.get('/qvq/reports/type/1')
            // console.log(res);
             // 基于准备好的dom，初始化echarts实例
            var myEcharts = echarts.init(document.getElementById('main'))
           var option1 = res.data.data //  var {legend,xAxis,yAxis,series}=res.data.data
            // Option
            var option2 = {
                 title: {
                    text: '堆叠区域图'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
            }
            
             // 使用刚指定的配置项和数据显示图表。
             this.options = {...option1,...option2}
            myEcharts.setOption(this.options)
        },
    }
}
</script>

<style scoped>

</style>