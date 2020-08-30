<template>
<el-card>
  <!-- //面包屑 -->
    <my-breat title1="商品管理" title2="商品列表"></my-breat>
  <!-- //按钮 -->
    <div class="add-goods">
      <el-input
        @clear="lodgingData"
        clearable
       size="large" placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button @click="seacherGoods" slot="append" icon="el-icon-search"></el-button>
      </el-input>
       <el-button type="success"  @click="goGoodsadd()">添加商品</el-button>
    </div>

  <!-- //表格 -->
    <el-table
    :data="goodsList"
    height="400px"
    border
    style="width: 100%">
    <el-table-column
      prop="goods_name"
      label="商品名称">
    </el-table-column>
    <el-table-column
      prop="goods_price"
      label="商品价格（元）"
      width="80">
    </el-table-column>
    <el-table-column
      prop="goods_weight"
      label="商品重量"
      width="100">
    </el-table-column>
    <el-table-column
      prop="add_time"
      label="创建时间"
      width="100">
      <template slot-scope="goodsList">
          {{goodsList.row.add_time | fildate}}
        </template>
    </el-table-column>
    <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="primary" @click="openChangeGoods(scope.row)" :plain="true"  icon="el-icon-edit" circle size="mini"></el-button>
          <el-button type="danger" @click="deleteGoods(scope.row.goods_id)" icon="el-icon-delete" :plain="true"  circle size="mini"></el-button> 
        </template>
    </el-table-column>
  </el-table>

    <!-- //页码栏 -->
    <div class="block">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagesize"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>


    <!-- 对话框 -->
    <!-- //编辑商品 -->
    <el-dialog title="编辑商品" :visible.sync="dialogChangeGoods">
      <el-form :model="goodsform">
        <el-form-item label="商品名称" label-width="120px">
          <el-input v-model="goodsform.goods_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" label-width="120px">
          <el-input v-model="goodsform.goods_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" label-width="120px">
          <el-input v-model="goodsform.goods_number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" label-width="120px">
          <el-input v-model="goodsform.goods_weight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" label-width="120px">
          <el-input v-model="goodsform.goods_introduce" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeGoods = false">取 消</el-button>
        <el-button type="primary" @click="changGoods()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
    name:'goods',
    data() {
        return {
            query:'',
            goodsList: [],
            pagenum: 1,
            pagesize: 20,
            goodsform:{
                goods_name:'',   //商品名称
                goods_price: '', //价格
                goods_number: '', //数量 
                goods_weight: '', //重量
                goods_introduce: '', //介绍  (可以为空) 
            },
            dialogChangeGoods: false,
            changeGoodsId: -1,
            total: 1,
        }
    },
    created() {
        this.getGoodsList()
    },
    methods:{
        async getGoodsList() {
            const res = await this.axios.get(`/qvq/goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            // console.log(res);
            this.goodsList = res.data.data.goods
            this.total = res.data.data.total
        },
        seacherGoods() {
            this.getGoodsList()
        },
        goGoodsadd() {
            this.$router.push({name:'goodsAdd'})
        },
        //点击先打叉重新加载数据
        lodgingData() {
            this.getGoodsList()
        },
        openChangeGoods(goods) {
            this.changeGoodsId = goods.goods_id
            // console.log(goods);
            this.dialogChangeGoods = true
        },
        async changGoods() {
            const res = await this.axios.put(`/qvq/goods/${this.changeGoodsId}`,this.goodsform)
            // console.log(res);
            this.dialogChangeGoods = false
            this.getGoodsList()
        },
        async deleteGoods(goodId) {
            const res = await this.axios.delete(`/qvq/goods/${goodId}`)
            // console.log(res);
            this.getGoodsList()
        },
         //页码方法
        handleSizeChange(val) {
        this.pagesize=val
        this.getGoodsList()
        },
        handleCurrentChange(val) {
        this.pagenum=val
        this.getGoodsList()
        },
    }
}
</script>

<style scoped>
.add-goods{
   display: flex;
   margin-top: 15px;
   width:400px;
}
.block{
    margin-top: 20px;
}
</style>