<template>
  <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索框 -->
            <el-row :gutter="20">
                <el-col :span=8>
                    <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span=4>
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- table表格 -->
            <el-table :data="goodsList" border stripe >
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFromat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="btnEdit(scope.row.goods_id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="btnDelete(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total" background>
            </el-pagination>
        </el-card>
        
        <!-- 点击修改的对话框 -->
        <el-dialog
        title="提示"
        :visible.sync="editDialogVisible"
        width="50%">
        <!-- <template slot-scope="scope">
            <el-form>
                <el-form-item label="活动名称" :label-width="formLabelWidth">
                    <el-input v-model="goodsList.goods_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </template> -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询参数对象
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            // 商品数据列表
            goodsList:[],
            // 总数据条数
            total:0,

            // 输入框数据绑定
            iptVal:'',

            // 控制修改对话框的显示隐藏
            editDialogVisible:false
        }
    },
    created() {
        // 在开始获取商品列表
        this.getGoodsList()
    },
    methods: {
        // 根据分页获取对应商品列表
        async getGoodsList(){
            const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
            if(res.meta.status!==200){
                return this.$message.error('获取商品数据失败')
            }
            this.$message.success('获取商品数据成功')
            this.goodsList = res.data.goods
            this.total = res.data.total
        },
        //分页功能
        handleSizeChange(newSize){
            console.log(newSize);
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        //分页功能

        handleCurrentChange(newpage){
            this.queryInfo.pagenum = newpage
            this.getGoodsList()

        },
        //点击删除
        async btnDelete(id){
            const resultRemove= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err => err);

            if(resultRemove!=='confirm'){
                return this.$message.error('取消删除')
            }
            const {data:res} = await this.$http.delete(`goods/${id}`)
            if(res.meta.status!==200){
                return this.$message.error('删除失败')
            }
            this.getGoodsList()
            this.$message.success('确认删除')
        },
        //点击修改商品属性
        btnEdit(){
            this.editDialogVisible=true
        },
        // 点击跳转
        goAddPage(){
            this.$router.push('/goods/add')
        }
        
        
    },
}
</script>

<style lang="scss" scoped>

</style>