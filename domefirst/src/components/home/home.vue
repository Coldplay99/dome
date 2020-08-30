<template>
  <el-container class="home">
  <el-header>
      <header-nav/>
  </el-header>
  <el-container>
    <el-aside width="200px" class="aside-home">
        <aside-user/>
    </el-aside>
    <el-main class="main-home">
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
    import headerNav from '../../components/home/header/headerNav.vue'
    import asideUser from '../../components/home/aside/asideUser.vue'
export default {
    name: 'home',
    components: {
        headerNav,
        asideUser,
    },
    // beforeCreate () {
    //     const token =localStorage.getItem('token')
    //     if(!token){
    //         this.$router.push({name:'login'})
    //     }
    // }
}
</script>

<style>
    .home{
        height: 100vh;
    }
    .aside-home{
        height: 90%;
        background-color: #fff;
        height: 100%;
    }
    .main-home{
        background-color: #fff;
        width: 100%;
        height: 90%;
        box-sizing: border-box;
    }
</style>