<template>
  <el-card>
    <!-- //面包屑 -->
    <my-breat title1="商品管理" title2="分类参数"></my-breat>
    <el-button class="addCate" @click="addCate()" type="success">添加分类</el-button>
    <el-table
    height=550px
    :data="paramsList"
    style="width: 100%;">
        <el-tree-grid
        file-icon=" " 
        folder-icon=" " 
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children">
        </el-tree-grid>
        <el-table-column
        label="层级">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_level === 0 ">一级</span>
                <span v-else-if="scope.row.cat_level === 1 ">二级</span>
                <span v-else-if="scope.row.cat_level === 2 ">三级</span>
            </template>
        </el-table-column>
        <el-table-column
        label="是否有效">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_deleted === false" >有效</span>
                <span v-else-if="scope.row.cat_deleted === true" >无效</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
            <el-button size="mini" @click="ChangeParamsBtn(scope.row) " plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button size="mini" @click="daleteParams(scope.row.id)" plain type="danger" icon="el-icon-delete" circle></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- //对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAddCate">
        <el-form :model="form">
            <el-form-item label="分类名称" label-width="120px">
            <el-input v-model="form.cat_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="分类" label-width="120px">
                <div class="block">
                    <el-cascader
                    :show-all-levels="false"
                    clearable
                    :props="propsSel"
                    v-model="value"
                    :options="options"
                    @change="handleChange"></el-cascader>
                </div>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAddCate = false">取 消</el-button>
            <el-button type="primary" @click="addCateCherk()">确 定</el-button>
        </div>
    </el-dialog>
  </el-card>
</template>

<script>
var ElTreeGrid = require('element-tree-grid')
export default {
    name:'params',
    components:{
        ElTreeGrid
    },
    data() {
        return{
            paramsList:[],
            type: 3,
            pagesize:50,
            dialogFormVisibleAddCate: false,
             //存放的是选项里面的id值
            value: [],
            // 存放完整的数据
            options:[],
            //让完整的数据等于指定的分类去显示
            propsSel:{
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            form:{
                cat_pid:-1,
                cat_name:'',
                cat_level:-1
            }
        }
    },
    created (){
        this.getParamsList()
    },
    methods:{
        //获取数据列表
        async getParamsList() {
            const res = await this.axios.get(`/qvq/categories?type=${this.type}&pagenum=''&pagesize=${this.pagesize}`)
            // console.log(res);
            this.paramsList = res.data.data.result
        },
        // 获取对话框里面的选择数据
        async getgoodsData() {
            const res = await this.axios.get('/qvq/categories?type=2')
            this.options = res.data.data
            // console.log(res.data.data)
        },
        ChangeParamsBtn(scope) {

        },
        daleteParams(scope) {

        },
        //添加按钮打开对话框 调用对话框里面的选择数据
        addCate() {
            this.dialogFormVisibleAddCate = true
            this.getgoodsData()
        },
        // 选择数据里面的id值
        handleChange(val) {
            // console.log(val);
            this.value = val
        },
        //提交数据，更新表格
        async addCateCherk() {
            // 通过判断数组长度赋值
            if(this.value.length ===0 ){
                // form:{
                // cat_pid:-1,
                // cat_name:'',
                // cat_level:-1 }
                this.form.cat_pid = 0
                this.form.cat_level = 0
            } else if(this.value.length ===1 ){
                this.form.cat_pid = this.value[0]
                this.form.cat_level = 1
            }else if(this.value.length ===2 ){
                this.form.cat_pid = this.form.cat_pid = this.value[1]
                this.form.cat_level = 2
            }
            const res = await this.axios.post(`/qvq/categories`,this.form)
            // console.log(res);
            this.getParamsList()
            this.dialogFormVisibleAddCate = false
            
        }
    }
}
</script>

<style scoped>
.addCate,.block{
    float: left;
}
</style>