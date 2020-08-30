<template>
  <div class="main-home">
    <!-- //面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索栏 -->
    <div style="margin-top: 15px;">
      <el-input
        @clear="lodgingData"
        clearable
       size="large" placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button @click="seacherData" slot="append" icon="el-icon-search"></el-button>
      </el-input>
       <el-button class="add-main" type="success"  @click="dialogFormAdd">添加用户</el-button>
    </div>
  <!-- 信息栏 -->
    <el-table
      class="table-main"
      :data="tableData"
      border
      style="width: 100%;">
      <el-table-column
        type="index"
        fixed
        label="#"
        width="80">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮编"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="120">
      </el-table-column>
      <!-- 处理日期格式 create_time: 1486720211 -->
      <el-table-column
        prop="create_time"
        label="创建日期"
        width="100">
        <template slot-scope="tableData">
          {{tableData.row.create_time | fildate}}
        </template>
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态"
        width="80">
        <template slot-scope="scope">
          <el-switch
            @change="changeMgStatus(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="250">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleClick(scope.row)" :plain="true"  icon="el-icon-edit" circle size="mini"></el-button>
          <el-button type="success" @click="roleClick(scope.row)" icon="el-icon-check" :plain="true"  circle size="mini"></el-button>
          <el-button type="danger" @click="deleteuser(scope.row.id)" icon="el-icon-delete" :plain="true"  circle size="mini"></el-button> 
        </template>
      </el-table-column>
    </el-table>
    <!-- //页码栏 -->
    <div class="block block-main">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[3,4,5]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

  <!-- //用户添加对话框 -->
    <el-dialog title="用户添加" :visible.sync="dialogFormVisibleAdd">
      <el-form class="form-dialog" :model="form">
        <el-form-item label="用户名:" label-width="120px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码:" label-width="120px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" label-width="120px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话:" label-width="120px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </div>
    </el-dialog>
  <!-- //编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleChange">
      <el-form class="form-dialog" :model="form">
        <el-form-item label="用户名:" label-width="120px">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" label-width="120px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话:" label-width="120px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleChange = false">取 消</el-button>
          <el-button type="primary" @click="handleClickSave()">确 定</el-button>
        </div>
    </el-dialog>
  
  <!-- //分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible">
      <el-form :model="form">
        <el-form-item label="用户名:">
          <p class="role-form">{{currentName}}</p>
        </el-form-item>
        <el-form-item label="角色:">
          <el-select class="role-form" v-model="currentRoleId" :placeholder="roleList.roleName">
            <el-option v-for="(item,i) in roleList" :key="i" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkRole()">确 定</el-button>
      </div>
    </el-dialog>
  
  </div>
</template>

<script>
export default {
  name:'mainContent',
  data() {
    return {
      query: '',
      pagenum:1,
      pagesize:3,
      total:-1,
      tableData: [],
      dialogFormVisibleAdd: false,
      dialogFormVisibleChange: false,
      dialogRoleVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      roleList:[],
      currentName:'',
      currentRoleId: -1,
      currentUserId: -1,
    }
  },
  created(){
      this.gettableData()
  },
  methods:{
    async gettableData() {

        const res = await this.axios.get(`/qvq/users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        console.log(res)
        const {
          meta:{msg,status},
          data:{total,users}
        } = res.data
        if(status===200){
          this.tableData = users
          this.total = total
          this.$message.success(msg)
        }else{
          this.$message.warning(msg)
        }
    },
    
    //页码方法
      handleSizeChange(val) {
      this.pagesize=val
      this.gettableData()
    },
    handleCurrentChange(val) {
      this.pagenum=val
      this.gettableData()
    },
    //搜索关键字数据
    seacherData() {
        this.gettableData()
    },
    //点击先打叉重新加载数据
    lodgingData() {
        this.gettableData()
    },
    //弹框是否出现和消失
    dialogFormAdd() {
      this.dialogFormVisibleAdd = true
    },
    //添加用户
    async adduser() {
      this.dialogFormVisibleAdd = false
      const res = await this.axios.post('/qvq/users',this.form)
      const {data , meta : {msg ,status}} = res.data
      console.log(res.data)
      if(status===201){
        this.gettableData()
        this.form={}
        this.$message.success('添加成功')
      }
    },
    //删除用户
    //通过id来删除，传入参数
    //在按钮组件里面通过scop.row.id拿到id号
    deleteuser(userId) {
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          const res= await this.axios.delete(`/qvq/users/${userId}`)
          const {meta: {status,msg},data} = res.data
           if(status===200) {
            this.pagenum = 1
            this.gettableData()
          }

          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })          
        })
    },
    //编辑用户信息
    handleClick(row) {
      this.dialogFormVisibleChange = true
      this.form = row
      // console.log(row)
    },
    //编辑用户信息保存到数据库
    async handleClickSave() {
      const res = await this.axios.put(`/qvq/users/${this.form.id}`,this.form)
      if(res.data.meta.status===200) {
        this.gettableData()
        this.dialogFormVisibleChange = false
      }
    },
    //改变状态
    async changeMgStatus(userId) {
      const res = await this.axios.put(`/qvq/users/${userId.id}/state/${userId.mg_state}`)
      // console.log(res)
    },
    //角色分配
    async roleClick(userId) {
      this.dialogRoleVisible= true
      //查询用户的id的数据请求
      const resId = await this.axios.get(`/qvq/users/${userId.id}`)
      // console.log(resId.data)
      this.currentName = resId.data.data.username
      //存下id值在确定修改用户角色请求中使用
      this.currentUserId = resId.data.data.id
      //请求角色分类，通过数组保存在组件中for循环生成
      //在select option组件中 当v-module 和option中的value绑定的值一样是会同时显示当前选择
      const res = await this.axios.get('/qvq/roles')
      this.roleList = res.data.data
      this.currentRoleId = resId.data.data.rid

      // console.log(this.roleList)
    },
    //修改角色分配确定
    async checkRole() {
      //
      const res = await this.axios.put(`/qvq/users/${this.currentUserId}/role`,
      {rid: this.currentRoleId})
      // console.log(res)
      this.dialogRoleVisible = false
    }
  }
}
</script>
    

<style scoped>
.main-home{
  width: 100%;
}
.input-with-select{
  width: 60%;
  float: left;
}

.add-main{
  float: left;
  margin-left: 10px;
}

.table-main{
   margin-top: 90px;
}
.block-main{
  float: left;
  margin-top: 30px;
}
.form-dialog{
  margin-left: -60px;
}
.role-form{
  float: left;
  margin: 0;
}
</style>