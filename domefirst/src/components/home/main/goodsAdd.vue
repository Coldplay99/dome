<template>
  <el-card>
   <el-form  label-position="left"  :model="form">
     <!-- //面包屑 -->
    <my-breat title1="商品管理" title2="商品列表"></my-breat>
    <!-- //提示文 -->
    <el-alert
    title="添加商品信息"
    type="success"
    center
    show-icon>
    </el-alert>
    <i @click="goBackBef()" class="el-icon-back backBtn"></i>
    <!-- //步骤条 -->
    <el-steps
    align-center
    class="steps-goods"
    :space="200"
    :active="1*activeName" 
    finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- //内容导航 -->
    <el-tabs v-model="activeName" tab-position="left" @tab-click="tabClick" style="height: 600px;">
        <!-- 基本信息 -->
        <el-tab-pane name="1" label="基本信息">
                <el-form-item label="商品名称">
                    <el-input  v-model="form.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input  v-model="form.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input  v-model="form.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input  v-model="form.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <div class="block">
                        <el-cascader
                        :props="propsSel"
                        v-model="value"
                        :options="options"
                        @change="handleChange"></el-cascader>
                    </div>
                </el-form-item>
        </el-tab-pane>

        <!-- 商品参数 -->
        <el-tab-pane name="2" label="商品参数">
                <el-form-item :label="item.attr_name" v-for="(item,i) in manydata" :key="i">
                    <el-checkbox-group class="checkList" v-model="item.attr_vals">
                        <el-checkbox border="" v-for="(item1,i) in item.attr_vals" :key="i" :label="item1"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
        </el-tab-pane>

        <!-- 商品属性 -->
        <el-tab-pane name="3" label="商品属性">
                <el-form-item
                :label="item.attr_name"
                v-for="(item,i) in onlyList"
                :key="i">
                    <el-input  v-model="item.attr_vals" 
                    ></el-input>
                </el-form-item>
        </el-tab-pane>

        <!-- 商品图片 -->
        <el-tab-pane name="4" label="商品图片">
            <el-form-item>
                <el-upload
                class="upload-demo"
                :headers="headers"
                action="https://api.naccl.top/vue/shop/api/private/v1/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
        </el-tab-pane>
        <!-- 商品内容 -->
        <el-tab-pane name="5" label="商品内容">
            <el-form-item>
                <el-row class="box-add">
                    <el-button @click="addGoods()" class="add-text" type="primary">添加角色</el-button>
                </el-row>
                <quill-editor v-model="form.goods_introduce"/>
            </el-form-item>
        </el-tab-pane>
    </el-tabs>
   </el-form> 
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
    name:'goodsAdd',
   components:{
        quillEditor
   },
    data() {
        return {
            //双向绑定每个路由的值  此处有个小细节在数据类型转换
            activeName:'1',
            form:{
                goods_name:'',   //商品名称
                goods_cat: '',   //以为','分割的分类列表
                goods_price: '', //价格
                goods_number: '', //数量 
                goods_weight: '', //重量
                goods_introduce: '', //介绍   
                pics: [],  //上传的图片临时路径（对象）
                attrs: []  //商品的参数（数组），包含 `动态参数` 和 `静态属性`
            },
            //存放的是选项里面的id值
            value:'',
            // 存放完整的数据
            options:[],
            //让完整的数据等于指定的属性值去显示
            propsSel:{
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            //动态数组存放
            manydata:[],
            //静态属性数组存放
            onlyList: [],
            // 设置请求头部
            headers:{
                Authorization:localStorage.getItem('token')
            },
        }
    },
    created () {
        this.getgoodsData()
    },
    methods: {
        // 获取数据
      async getgoodsData() {
        const res = await this.axios.get('/qvq/categories?type=3')
        this.options = res.data.data
        // console.log(res.data.data)
      },
      handleChange(value) {
        //   console.log(value);
      },
      //当在获取数据是url选择type=3时做出判断
      async tabClick() {
          if(this.activeName === "2"){
            if(this.value.length !="3"){
                this.$message.warning('请选择三级分类') 
                return
            }
            const res = await this.axios.get(`/qvq/categories/${this.value[2]}/attributes?sel=many`)
            console.log(res.data.data)
            this.manydata = res.data.data
            this.manydata.forEach(item => {
               item.attr_vals = item.attr_vals.length===0 ? []: item.attr_vals.trim().split(',')
                
            })
          }else if(this.activeName === "3"){
            const res1 = await this.axios.get(`/qvq/categories/${this.value[2]}/attributes?sel=only`)
            // console.log(res1);
            this.onlyList = res1.data.data
          }
      },
    //   点击文件列表中已上传的文件时的钩子	function(file)
       handlePreview(file) {
         
      },
    //   on-remove	文件列表移除文件时的钩子	function(file, fileList)
      handleRemove(file) {

        //!!!由于作者关闭接口 图片上传不了 学方法便可 !!!

          //要删除临时路径就需要在临时路径的数组pics中找到要删的索引
        //   findIndex方法是寻找到索引的
        //与forEach方法使用一样
        // const index = this.form.pics.findIndex(item => {
        //    return item.pics = file.response.data.tmp_path //临时路径
        // })
        //   this.form.pics.splice(index,1)

      },
        //  on-success	文件上传成功时的钩子function(response, file, fileList)	
        handleSuccess(file) {
        // 获取得路径 ！！由于作者关闭接口 未拿到图片地址
        console.log(file);
        //   this.form.pics.push({
        //       pics : file.data.tmp_path //临时路径
        //   })
      },
      //添加商品

      //功能不能实现 ，仅是代码而已

      async addGoods() {
          this.form.goods_cat = this.value.join(',')
    
          let arr1 = this.manydata.map(item => {
              return {
                  attr_id:item.attr_vals,
                  attr_value:item.attr_vals
              }
          })
          let arr2 = this.onlyList.map(item => {
              return {
                  attr_id:item.attr_vals,
                  attr_value:item.attr_vals
              }
          })
          this.form.attrs = [...arr1,...arr2]

          const res = await this.axios.post('/qvq/goods',this.form)
          console.log(res);
          this.$router.push({name:'goods'})

      },
      //返回上一路由
      goBackBef() {
          this.$router.push({name:'goods'})
      }
    }
}
</script>

<style scoped>
.steps-goods{
   margin: 20px 0;
}
.block{
    float: left;
}
.box-add{
    overflow: hidden;
    margin: 20px 0;
}
.add-text{
    float: left;
}
.checkList{
    display: flex;
}
.backBtn{
    font-size: 30px;
    margin-top: 20px;
    float: left;
}
</style>