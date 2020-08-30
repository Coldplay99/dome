<template>
  <el-col :span="24">
    <el-menu 
      class="el-menu-vertical-demo"
      active-text-color="#409EFF"
      :router="true"
      :unique-opened="true">
      <user-list/>
    </el-menu>
  </el-col>
</template>

<script>
   import userList from './userList'
export default {
    name:'asideUser',
    components: {
        userList

    },
    methods: {
       
      }
}
</script>

<style>
</style>