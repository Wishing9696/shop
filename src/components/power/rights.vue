<template>
  <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <el-table :data="rightsList" border stripe >
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <!-- 权限tag -->
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level === '1'">二级权限</el-tag>
                        <el-tag type="danger" v-else>三级权限</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return {
            //权限列表
            rightsList:[]
        }
    },

    //在created阶段获取数据
    created(){
        this.geiRightsList()
    },

    methods:{

        //获取权限列表数据
        async geiRightsList(){
            const {data:res} = await this.$http.get('rights/list')
            console.log(res);
            if(res.meta.status !== 200){
                return this.$message.error('权限数据请求失败')
            }
            this.rightsList = res.data
        }
    }
}
</script>

<style>

</style>