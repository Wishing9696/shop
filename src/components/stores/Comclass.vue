<template>
  <div>

    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>

      <!-- 添加按钮 -->
      <el-row>
          <el-col>
            <el-button type="primary" @click="showAddCatlogVisible">点击添加商品</el-button>
          </el-col>

      </el-row>

      <!-- 树型表格 -->
      <tree-table class="treeTable" :data="cateList" :columns="columns" 
      :selection-type="false"
      :expand-type="false"
      show-index
      index-text="#"
      border
      :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editClass(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">搜索</el-button>
        </template>

      </tree-table>

      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 8, 3]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
        </el-pagination>
      </el-card>
       
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatlogVisible"
      width="50%"
      @close="addDialogClosed">
      <!-- 添加分类的表单 -->
      <el-form :model="addCatFrom" :rules="addCatFromRules" ref="addCatFromRef" label-width="100px">

        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCatFrom.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类:">
          <!-- options指定数据源 props指定配置对象-->
            <el-cascader
            v-model="selectedKeys"
            :options="parentCreatList"
            :props="casCarderProps"
            @change="parentcatechange"
            clearable
            change-on-select>
            
            </el-cascader>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatlogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑商品信息"
      :visible.sync="editDialogVisible"
      width="50%">
      <template>
        <el-form label-width="100px">
          <el-form-item label="编辑信息">
            <el-input v-model="editList" ></el-input>
          </el-form-item>
      </el-form>
      </template>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updataGoods(scope.row)">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
    data() {
      return {
        // 编辑商品的修改内容
        editList:'',
        // 控制编辑商品信息对话框的弹出
        editDialogVisible:false,
        // 级联选择器选中的父级分类的ID数组
        selectedKeys:[],
        // props指定级联选择器的配置对象
        casCarderProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children'
        },
        
        //父级分类的数据列表
        parentCreatList:[],

        // 添加分类表单绑定的数据对象
        addCatFrom:{
        // 将要添加的分类名称
        cat_name:'',
        // 分级分类的ID
        cat_pid :0,
        // 分类等级，默认添加的是一级分类
        cat_level: 0
      },

      // 添加分类表单的验证规则对象
      addCatFromRules:{
        cat_name:[
          {required:true, message:'请输入分类的名称',trigger:'blur'}
        ]
      },

        // 添加分类的表单数据对象
        addCatFrom:{},

      // 控制添加分类对话框的显示与隐藏
      addCatlogVisible:false,

      // 商品分类的数据列表
      cateList:[],

      //getLIST请求体
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },

      //商品数据总条数
      total:0,

      // 为table指定列的定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          //将当前列定义为模板列
          type:'template',
          // 当前列模板的使用名称
          template:'isok'
        },
        {
          label:'排序',
          //将当前列定义为模板列
          type:'template',
          // 当前列模板的使用名称
          template:'order'
        },
        {
          label:'操作',
          //将当前列定义为模板列
          type:'template',
          // 当前列模板的使用名称
          template:'opt'
        }
        ]
      }
    },
    created() {
      this.getCateList()
    },
    methods:{

      //获取商品分类数据
      async getCateList(){
        let {data:res} = await this.$http.get('categories',{params:this.queryInfo})
        if(res.meta.status !==200){
          return this.$message.error('获取商品分类失败！')
        }

        //把数据存储到cateList中
        this.cateList = res.data.result
        //为数据总条数赋值
        this.total = res.data.total
        return this.$message.success('获取商品分类成功')
      },

      // 监听pagesize的改变
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },

      // 监听pagenum的改变
      handleCurrentChange(newNum){
        this.queryInfo.pagenum = newNum
        this.getCateList()
      },

      // 点击按钮显示AddCatlogVisible对话框
      showAddCatlogVisible(){
        // 先获取父级分类的数据列表
        this.getParentList()
        // 然后再展示对话框
        this.addCatlogVisible = true
      },

      //获取父级分类的数据列表
      async getParentList(){
        const {data:res} = await this.$http.get('categories',{params:{type:2}})
        if (res.meta.status!==200) {
          return this.$message.error('获取父级数据失败')
        }
        this.parentCreatList=res.data
      },
      // 选择项发生改变触发这个函数
      parentcatechange(){
        // console.log(this.selectedKeys);
        //如果selectedKeys这个数组的长度大于0则说明选中
        if(this.selectedKeys.length>0){
          // 父类分级的ID
         this.addCatFrom.cat_pid= this.selectedKeys[this.selectedKeys.length-1]
          //  当前分类的等级赋值
         this.addCatFrom.cat_level=this.selectedKeys.length
         return
        }else{
          // 父类分级的ID
          this.addCatFrom.cat_pid= 0
          //  当前分类的等级赋值
         this.addCatFrom.cat_level=0
        }
      },
      // 点击按钮添加，添加新的分类
      addCate(){
        // console.log(this.addCatFrom);
        this.$refs.addCatFromRef.validate(async valid=>{
          if(!valid) return
          const {data:res} = await this.$http.post('categories',this.addCatFrom)
          // console.log(res);
          if(res.meta.status !== 201){
            return this.$message.error('添加分类失败')
          }
        })
        
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCatlogVisible=false
      },
      // 监听添加分类对话框的关闭事件重置表单数据
      addDialogClosed(){
        this.$refs.addCatFromRef.resetFields()
        this.selectedKeys=[]
        this.addCatFrom.cat_level=0
        this.addCatFrom.cat_pid=0
      },
      // 点击弹出编辑商品信息
      editClass(res){
        this.editDialogVisible=true
      },
      //更新商品数据
      updataGoods(){
        
      }
    }
}
</script>

<style lang="scss" scoped>
.treeTable{
  margin-top: 20px;
}
.el-cascader{
  width: 100%;
}
</style>