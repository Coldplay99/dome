<template>
    <el-card>
        <my-breat title1="商品管理" title2="分类参数"></my-breat>
        <!-- //提示 -->
        <el-alert
            class="tip"
            title="只允许为三级分类设置参数"
            type="error"
            show-icon>
        </el-alert>
        <!-- //导航 -->
        <el-form>
            <el-form-item label="商品名称">
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
            <el-form-item>
                <el-tabs type="border-card">
                    <el-tab-pane label="动态参数">
                        <el-button
                        class="block" 
                        type="danger" 
                        :disabled="value.length === 0 ? true : false"
                        @click="addManyCategories()">添加动态属性</el-button>
                         <el-table
                            :data="manyList"
                            height="400px"
                            border
                            style="width: 100%">
                            <el-table-column
                            label="#"
                            width="100"
                            type="expand">
                                <template slot-scope="scope">
                                    <el-tag
                                    :key="i"
                                    v-for="(item,i) in scope.row.attr_vals"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose(i,scope.row)">
                                    {{item}}
                                    </el-tag>
                                    <el-input
                                    class="input-new-tag"
                                    v-if="inputVisible"
                                    v-model="inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column
                            prop="attr_name"
                            label="商品名称">
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="100">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="openChangecategories(scope.row)" :plain="true"  icon="el-icon-edit" circle size="mini"></el-button>
                                    <el-button type="danger" @click="deletecategories(scope.row.goods_id)" icon="el-icon-delete" :plain="true"  circle size="mini"></el-button> 
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="静态参数">
                        <el-button
                        @click="addOnlyCategories()"
                        class="block" 
                        type="danger" 
                        :disabled="value.length === 0 ? true : false">添加静态属性</el-button>
                        <el-table
                        :data="onlyList"
                        height="400px"
                        border
                        style="width: 100%">
                        <el-table-column
                        label="#"
                        type="index"
                        width="100">
                        </el-table-column>
                        <el-table-column
                        prop="attr_name"
                        label="属性名称">
                        </el-table-column>
                        <el-table-column
                        prop="attr_vals"
                        label="属性值">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="100">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="openChangecategories(scope.row)" :plain="true"  icon="el-icon-edit" circle size="mini"></el-button>
                                <el-button type="danger" @click="deletecategories(scope.row.goods_id)" icon="el-icon-delete" :plain="true"  circle size="mini"></el-button> 
                            </template>
                        </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-form-item>
        </el-form>
        <!-- //对话框 动态 -->
        <el-dialog title="添加动态属性" :visible.sync="dialogFormVisibleMany">
            <el-form :model="formMany">
                <el-form-item label="商品名称" label-width="120px">
                    <el-input v-model="formMany.attr_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-alert
                    title="商品内容描述 可为空"
                    type="warning"
                    show-icon>
                </el-alert>
                <el-form-item label="商品内容" label-width="120px">
                    <el-input v-model="formMany.attr_vals" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleMany = false">取 消</el-button>
                <el-button type="primary" @click="cherkManyCategories()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- //对话框 静态 -->
        <el-dialog title="添加静态属性" :visible.sync="dialogFormVisibleOnly">
            <el-form :model="formOnly">
                <el-form-item label="属性名称" label-width="120px">
                    <el-input v-model="formOnly.attr_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-alert
                    title="属性值描述 可为空"
                    type="warning"
                    show-icon>
                </el-alert>
                <el-form-item label="属性值" label-width="120px">
                    <el-input v-model="formOnly.attr_vals" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleOnly = false">取 消</el-button>
                <el-button type="primary" @click="cherkOnlyCategories()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    name:'categories',
    data (){
         return{
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
            //动态参数
            manyList: [],
            //静态参数
            onlyList: [],
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            dialogFormVisibleMany: false,
            dialogFormVisibleOnly: false,
            formMany: {
                attr_name:'',
                attr_sel:'many',
                attr_vals: ''
            },
             formOnly: {
                attr_name:'',
                attr_sel:'only',
                attr_vals: ''
            }
         }
    },
    created() {
        this.getgoodsData()
    },
    methods:{
        async getgoodsData() {
            const res = await this.axios.get('/qvq/categories?type=3')
            this.options = res.data.data
            // console.log(res.data.data)
        },
        async handleChange(value) {
            //动态数据请求
            const res = await this.axios.get(`/qvq/categories/${value[2]}/attributes/?sel=many`)
            // console.log(value);
            this.manyList = res.data.data
            if(this.value.length !="3"){
                this.$message.warning('只有三级分类 请选择')
                this.flagBtn = true 
                return
            }
            this.manyList.forEach(item => {
               this.dynamicTags = item.attr_vals = item.attr_vals.length===0 ? []: item.attr_vals.trim().split(',')
                // console.log(item.attr_vals);
            })
            //静态数据请求
            const res1 = await this.axios.get(`/qvq/categories/${value[2]}/attributes/?sel=only`)
            // console.log(res1);
            this.onlyList = res1.data.data
        },
        addManyCategories() {
            this.dialogFormVisibleMany = true
        },
        addOnlyCategories() {
             this.dialogFormVisibleOnly  = true
        },
        //动态添加商品属性
        async cherkManyCategories(){
            const res = await this.axios.post(`/qvq/categories/${this.value[2]}/attributes`,this.formMany)
            console.log(res);
            this.dialogFormVisibleMany = false
            this.handleChange(this.value)
        },
        //静态添加商品属性
        async cherkOnlyCategories(){
            const res = await this.axios.post(`/qvq/categories/${this.value[2]}/attributes`,this.formOnly)
            console.log(res);
            this.dialogFormVisibleOnly = false
            this.handleChange(this.value)
        },
        openChangecategories(c) {

        },
        // async deletecategories(d) {
        //     const res = await this.axios.delete(`/qvq/categories/${this.value[0]}/attributes/${this.value[2]}`)
        //     console.log(res);
        //     console.log(this.value);
        //     this.handleChange(this.value)
        // },
        //打叉后的方法
        async handleClose(tag,scope) {
            //ui框架的方法 此处的tag是我写的item
            // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
            this.dynamicTags.splice(tag, 1)
            let putData ={
                attr_name: scope.attr_name,
                attr_sel: 'many',
                attr_vals: scope.attr_vals.join(',')
            }
            const res = await this.axios.put(`/qvq/categories/${this.value[2]}/attributes/${scope.attr_id}`,
            putData
            )
            // console.log(res);
        },
        //news tag按钮
        showInput() {
            this.inputVisible = true
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        //news tag按钮添加后显示
        async handleInputConfirm(scope) {
            let inputValue = this.inputValue
            if (inputValue) {
            this.dynamicTags.push(inputValue)
            //在把数据存入数组后 请求数据进行更新
            let putData ={
                attr_name: scope.attr_name,
                attr_sel: 'many',
                attr_vals: scope.attr_vals.join(',')
            }
            const res = await this.axios.put(`/qvq/categories/${this.value[2]}/attributes/${scope.attr_id}`,
            putData
            )
            // console.log(res)
            }
            this.inputVisible = false
            this.inputValue = ''
        }
    }
}
</script>

<style scoped>
.block{
    float: left;
}
.tip{
    margin-bottom: 10px;
}
</style>