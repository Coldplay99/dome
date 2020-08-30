<template>
  <el-card>
    <!-- //面包屑 -->
    <my-breat title1="订单管理" title2="订单列表"></my-breat>
    <div style="margin-top: 15px;">
        <el-input placeholder="请输入订单号" v-model="input" class="input-with-select">
            <el-button slot="append" @click="seacherOrder()" icon="el-icon-search"></el-button>
        </el-input>
    </div>
     <el-table
      height="580px"
      :data="ordersList"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="60">
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="80">
      </el-table-column>
      <el-table-column
        label="支付方式"
        width="80">
        <template slot-scope="scope">
            <span v-if="scope.row.order_pay === '0' ">未支付</span>
            <span v-else-if="scope.row.order_pay === '1' ">支付宝</span>
            <span v-else-if="scope.row.order_pay === '2' ">微信</span>
            <span v-else-if="scope.row.order_pay === '3' ">银行卡</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单支付"
        width="80">
        <template slot-scope="scope">
            <span v-if="scope.row.pay_status === '0' ">否</span>
            <span v-else-if="scope.row.pay_status === '1' ">是</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货"
         width="80">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="下单时间">
        <template slot-scope="ordersList">
          {{ordersList.row.create_time | fildate}}
        </template>
      </el-table-column>
      <el-table-column 
      label="操作"
      width="120">
        <template slot-scope="scope">
            <el-button size="mini" @click="seacherAddress(scope.row)" plain type="primary" icon="el-icon-search" circle></el-button>
            <el-button size="mini" @click="ChangeAddress(scope.row)" plain type="primary" icon="el-icon-edit" circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- //对话框 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogChangeAddress">
        <el-form :model="form">
            <el-form-item label="省区" label-width="120">
                <div class="block">
                    <el-cascader
                    :show-all-levels="false"
                    clearable
                    :props="propsSel"
                    v-model="value"
                    :options="citydata"
                    @change="handleChange"></el-cascader>
                </div>
            </el-form-item>
            <el-form-item label="详细地址" label-width="120">
                <el-input v-model="form.address" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChangeAddress = false">取 消</el-button>
            <el-button type="primary" @click="dialogChangeAddress = false">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 搜索订单详情 -->
    <el-dialog title="订单详情" :visible.sync="dialogContents">
        <el-table :data="gridData">
            <el-table-column type="index" label="#" width="60"></el-table-column>
            <el-table-column property="goods_number" label="数量" width="100"></el-table-column>
            <el-table-column property="goods_price" label="单价" width="100"></el-table-column>
            <el-table-column property="goods_total_price" label="总计价钱"></el-table-column>
        </el-table>
    </el-dialog>

    <!-- //时间条 -->
    <el-dialog class="timeline" title="物流消息" :visible.sync="dialogTimeline">
        <el-timeline :reverse = "reverse">
        <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        icon="el-icon-success"
        type="primary"
        color="#0bbd87"
        size="large"
        :timestamp="activity.time">
        {{activity.context}}
        </el-timeline-item>
        </el-timeline>
    </el-dialog>
  </el-card>
</template>

<script>
import citydata from '@/assets/citydata.js'
export default {
    name:'orders',
    data() {
        return{
            ordersList:[],
            pagenum:1,
            pagesize:27,
            dialogChangeAddress: false,
            dialogContents: false,
            dialogTimeline: false,
            value:[],
            citydata:'',
             propsSel:{
                value: 'value',
                label: 'label',
                children: 'children'
            },
            form:{
                address:''
            },
            order_id: -1,
            gridData:[],
            //订单号
            order_number: '',
            // seacherId: 1106975712662,
            input:'',
            activities:[],
            reverse: false,
        }
    },
    created() {
        this.getOrdersList()
    },
    methods:{
        async getOrdersList() {
            // &user_id=''&pay_status=''&is_send=''&order_fapiao_title=''&order_fapiao_company=''&order_fapiao_content=''&consignee_addr=''
            const res = await this.axios.get(`/qvq/orders?query=''&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            // console.log(res);
            this.ordersList = res.data.data.goods
        },
        ChangeAddress(scoped) {
            this.dialogChangeAddress = true
            this.citydata = citydata
            // console.log(scoped);
        },
        async seacherAddress(scoped) {
            // console.log(scoped.order_id);
            this.order_id = scoped.order_id
            this.dialogContents = true
            const res = await this.axios.get(`/qvq/orders/${this.order_id}`)
            // console.log(res);
            this.gridData = res.data.data.goods
        },
        handleChange(val) {
            // console.log(val);
        },
        async seacherOrder() {
            this.dialogTimeline = true
            let input = parseInt(this.input)
            const res = await this.axios.get(`/qvq//kuaidi/${input}`)
            // console.log(res);
            this.activities = res.data.data
        }
    }
}
</script>

<style scoped>
.ordersList{
    height: 10000px;
}
.block{
    float: left;
}
</style>