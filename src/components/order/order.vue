<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            
            <div style="width:400px">
                <el-input placeholder="请输入内容" clearable>
                    <el-button slot="append" icon="el-icon-search" ></el-button>
                </el-input>
            </div>

            <el-table :data="orderList" stripe border>
                <el-table-column type="index" label="#" align="center"></el-table-column>
                <el-table-column label="订单编号" prop="order_number" width="500px" align="center"></el-table-column>
                <el-table-column label="订单价格" prop="order_price" width="80px" align="center"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status" width="100px" align="center">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status=== '1' ">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send" width="80px" align="center"></el-table-column>
                <el-table-column label="下单时间" prop="create_time" align="center">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFromat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 修改对话框 -->
        <el-dialog
        title="修改地址"
        :visible.sync="BoxdialogVisible"
        width="50%">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" >
            <el-form-item label="省市区/县" prop="address1">
                <el-cascader
    v-model="addressForm.address1"
    :options="citydata"
    @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
                <el-input type="password" v-model="addressForm.address2" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="BoxdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="BoxdialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import citydata from './citydata.js'

export default {
    data() {
        return {
            orderList:[],
            total:0,
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            // 当前页数
            orderCurrentPage:1,
            // 修改对话框的显示与隐藏
            BoxdialogVisible:false,
            // 表单验证对象
            addressForm:{
                address1:[],
                address2:''
            },
            // 级联选择器数据源
            citydata,
            // 验证规则
            addressFormRules:{
                address1:[
                    {required:true,message:'请选择省市区/县',trigger:'blur'}
                ],
                address2:[
                    {required:true,message:'请填写详细地址',trigger:'blur'}
                ]
            },
            
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        async getOrderList(){
            const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
            if(res.meta.status!==200){
                return this.$message.error('获取订单列表失败')
            }
            this.total= res.data.total
            this.orderList = res.data.goods
            this.$message.success('获取订单列表成功')
            // console.log(this.total);
            // console.log(this.tableData);
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize= newSize
            this.getOrderList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getOrderList()

        },
        // 展示修改地址的对话框
        showBox(){
            this.BoxdialogVisible=true
        }

    },
}
</script>

<style lang='scss' scoped>
.el-cascader{
    width: 100%;
}

</style>