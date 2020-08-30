<template>
    <div>
        <!-- 1 -->
        <el-submenu :index="''+item1.order" v-for="(item1,i) in menus" :key="i">
            <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span class="title-list">{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2,i) in item1.children" :key="i">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
            </el-menu-item>
        </el-submenu>
   
    </div>
</template>

<script>
export default {
  name:'userList',
    data () {
        return {
            menus: []
        }
    },
    created() {
        this.getMenus()
    },
    methods: {
        async getMenus() {
            const res = await this.axios.get('/qvq/menus')
            this.menus = res.data.data
            // console.log(res);
        }
    }
}
</script>

<style scoped>

.title-list{
    font-weight: bold;
}
</style>>