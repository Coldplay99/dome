<template>
<el-card>
  <!-- //面包屑 -->
  <my-breat title1="权限管理" title2="角色列表"></my-breat>
  <!-- //按钮 -->
  <el-row class="role-add">
    <el-button @click="addRolesBtn" type="primary">添加角色</el-button>
  </el-row>
  <!-- //表格 -->
    <el-table
      :data="rolesList"
      height="550"
      border
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <!-- //当为设置权限时显示 -->
            <span v-if="scope.row.children.length===0">未设置任何权限</span>
            <el-row v-for="(item1,i) in scope.row.children" :key="i" class="tag-list">
              <el-col :span="4">
                <!-- //点击打叉时删除掉权限
                //接口需求数据 角色 ID 和 权限 ID -->
                <el-tag @close="deleteQx(scope.row,item1.id)" class="tag-list" closable>{{item1.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row  v-for="(item2,i) in item1.children" :key="i">
                  <el-col :span="4">
                    <el-tag @close="deleteQx(scope.row,item2.id)" class="tag-list" type="success" closable>{{item2.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>

                  <el-col :span="20">
                    <el-tag @close="deleteQx(scope.row,item3.id)" class="tag-list item3-list" type="warning" closable v-for="(item3,i) in item2.children" :key="i" >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="#"
        width="100">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="ChangeRolesBtn(scope.row) " plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" @click="rightRoleQx(scope.row)" plain type="success" icon="el-icon-check" circle></el-button>
          <el-button size="mini" @click="daleteRoles(scope.row.id)" plain type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <!-- //权限对话框 -->
    <el-dialog
      title="添加权限"
      :visible.sync="dialogQxVisible"
      width="60%">
      <el-tree
        ref="tree"
        :data="dialogQxList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defauCheck"
        :props="{
          children: 'children',
          label: 'authName'
        }">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogQxVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleQx">确 定</el-button>
      </span>
    </el-dialog>

    <!-- //添加角色对话框 --> -->
    <el-dialog title="添加角色" :visible.sync="dialogAddRoles">
      <el-form :model="roles">
        <el-form-item label="角色名称" label-width="120px">
          <el-input v-model="roles.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="120px">
          <el-input v-model="roles.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddRoles = false">取 消</el-button>
        <el-button type="primary" @click="addRoles()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- //编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="dialogChangeRoles">
      <el-form :model="roles">
        <el-form-item label="角色名称" label-width="120px">
          <el-input v-model="roles.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="120px">
          <el-input v-model="roles.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeRoles = false">取 消</el-button>
        <el-button type="primary" @click="ChangeRoles()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
    name:'roles',
    data() {
      return {
        rolesList:[],
        dialogQxVisible: false,
        dialogQxList:[],
        defauCheck:[],
        currRoleID:-1,
        dialogAddRoles: false,
        dialogChangeRoles: false,
        roles:{
          roleName:'',
          roleDesc:''
        },
        changeRoleId:-1,
      }
    },
    created() {
      this.tableListQx()
    }
    ,
    methods: {
      async tableListQx() {
        const res = await this.axios.get('/qvq/roles')
        this.rolesList = res.data.data
        // console.log(this.rolesList);
      },
      //删除权限和更新表格
      async deleteQx(roleQx,childId) {
        const res =  await this.axios.delete(`/qvq/roles/${roleQx.id}/rights/${childId}`)
        // console.log(res)
     
        //删除角色权限是更新整个表格太麻烦了
        // this.tableListQx()
        //让角色权限实时的等下删除后的数据
        roleQx.children = res.data.data
      },
      //对话框显示和数据显示 请求数据用树状
      async rightRoleQx(role) {
        // 储存添加权限列表是当前角色的id currRoleID
        this.currRoleID = role.id

        this.dialogQxVisible = true
        const res = await this.axios.get('/qvq/rights/tree')
        this.dialogQxList = res.data.data
        // console.log(this.dialogQxList)


        //三重forEach循环把含有的角色权限id地址加入到数组中
        const currCheck=[]
        role.children.forEach(item1 => {
          currCheck.push(item1.id)
          item1.children.forEach(item2 => {
            currCheck.push(item2.id)
            item2.children.forEach(item3 => {
              currCheck.push(item3.id)
            })
          })
        })
        this.defauCheck = currCheck
      },
      //点击确定添加权限
      async addRoleQx() {

        // 节点可被选择（即 show-checkbox 为 true），
        // 则返回目前被选中的节点的 key(即权限的id值) 所组成的数组
        let arr1= this.$refs.tree.getCheckedKeys()

        // getHalfCheckedKeys() 节点可被选择（即 show-checkbox 为 true），
        // 则返回目前半选中的节点的 key(即权限的id值) 所组成的数组

        //通过ref绑定dom节点使用 像元素js操作dom元素
        let arr2= this.$refs.tree.getHalfCheckedKeys()  //没看清楚饿了么文档 踩坑

        // 数组合并 使用es6的class...
       let arrRole = [...arr1,...arr2]
        const res = await this.axios.post(`/qvq/roles/${this.currRoleID}/rights`,
        { rids:arrRole.join(',')})

        // console.log(res)

        //更新视图
        this.tableListQx()
        this.dialogQxVisible = false
      },
      //点击添加角色按钮
      addRolesBtn(){
        this.dialogAddRoles = true
      },
      // 添加角色按钮
      async addRoles() {
        const res = await this.axios.post(`/qvq/roles`,this.roles)
        this.tableListQx()
        this.dialogAddRoles = false
      },
      // 删除角色
      async daleteRoles(roleId) {
        const res = await this.axios.delete(`/qvq/roles/${roleId}`)
        // console.log(res)
        this.tableListQx()
      },
       //点击编辑角色按钮
      ChangeRolesBtn(role){
        this.roles.roleName = role.roleName
        this.roles.roleDesc = role.roleDesc
        this.dialogChangeRoles = true
        this.changeRoleId = role.id
      },
      //编辑角色名字描述
      async ChangeRoles(roleId) {
        const res = await this.axios.put(`/qvq/roles/${this.changeRoleId}`,this.roles)
        // console.log(res)
        this.dialogChangeRoles = false
        this.tableListQx()
      }
    }
}
</script>

<style scoped>
.role-add{
  float: left;
  margin-bottom: 20px;
  overflow: hidden;
}
.tag-list{
  margin: 10px 0;
}
.item3-list{
  margin-left: 5px;
}
</style>