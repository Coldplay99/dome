<template>
        <el-row>
            <el-col :span="6" class="logoBox">
                <div class="grid-content bg-purple header-logo"></div>
            </el-col>
            <el-col :span="16">
                <div class="grid-content bg-purple-light header-title">
                    后台管理系统
                </div>
            </el-col>
            <el-col :span="2"><div @click.prevent="handSignout" class="grid-content bg-purple header-back">退出</div></el-col>
        </el-row>
</template>

<script>
export default {
    name:'headerNav',
    methods:{
        handSignout(){
            localStorage.clear()
            this.$message.success('退出成功')
            this.$router.push({ name : 'Login' })
        }
    }
}
</script>

<style>
.header-home{
        background: #fff;
    }
    .logoBox{
        width: 100%;
        margin-left: -20px;
    }
    .header-logo{
        width: 100%;
        height: 60px;
        background-image: url('https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=274072883,172559683&fm=26&gp=0.jpg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
   }
    .header-title,.header-back{
        text-align: center;
        line-height: 60px;
    }
    .header-title{
        font-size: 30px;
    }
    .header-back{
       cursor: pointer;
    }
</style>