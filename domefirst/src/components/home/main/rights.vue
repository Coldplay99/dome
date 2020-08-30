<template>
  <el-card>
    <!-- //面包屑 -->
    <my-breat title1="权限管理" title2="权限列表"></my-breat>
    <!-- //表格 -->
    <el-table
      class="table-list"
      :data="rightList"
      border
      height="550"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="100">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0' ">一级</span>
          <span v-if="scope.row.level === '1' ">二级</span>
          <span v-if="scope.row.level === '2' ">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name:'rights',
  data() {
    return {
      rightList: [],

    }
  },
  created() {
    this.formListQx()
  },
  methods:{
    async formListQx() {
      const res = await this.axios.get('/qvq/rights/list')
      console.log(res)
      this.rightList = res.data.data
    }
  }
}
</script>

<style scoped>
.table-list{
  margin-top: 30px;
}
</style>