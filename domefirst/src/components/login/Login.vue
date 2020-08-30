<template>
  <div class="login">
    <el-form class="form-login" :label-position="labelPosition" label-width="auto">
      <h1>用户登录界面</h1>
      <el-form-item label="用户名">
        <el-input v-model="formLabelAlign.username" name="username"></el-input>
      </el-form-item>
      <el-form-item label="密 码">
        <el-input v-model="formLabelAlign.password" name="password"></el-input>
      </el-form-item>
      <el-button type="primary" @keyup.enter.native="LoginData" round class="btn-login" @click="LoginData">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'login',
  components:{
    
  },
  data() {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        username: '',
        password: ''
      },
      typetxt:'success'
    }
  },
  methods :{
    async LoginData () {

     const res = await this.axios.post('/qvq/login',this.formLabelAlign)
     const {data , meta : {msg ,status}} = res.data
        if(status===200){
          this.typetxt="success"
          localStorage.setItem('token',data.token)
          this.$router.push({ name : 'home' })
        }else{
          this.typetxt="warning"
        }
        this.$message({
        message: msg,
        type: this.typetxt
        })
    }
  }
}
</script>

<style>
  .login{
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: cadetblue;
  }
 .form-login{
    width: 400px;
    height: 300px;
    background-color: #ffffff;
    padding: 20px 30px;
  }
  .btn-login{
      width: 100%;
      margin-top: 20px;
    }
</style>

