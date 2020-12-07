<template>
<div>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card class="box-card">

    <!-- 搜索区域 -->
    <el-row :gutter="20">
      <el-col :span='8'>
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserlist">
          <el-button slot="append" icon="el-icon-search" @click="getUserlist"></el-button>
        </el-input>
      </el-col>
      <el-col :span='4'>
        <el-button type="primary" @click="addDialogVisible=true ">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 用户列表区 -->
    <el-table :data="userList" border stripe>
      <el-table-column label="#" prop="username" type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态" >
        <template slot-scope="scope">
          <!-- {{scope.row.mg_state}} -->
          <el-switch v-model="scope.row.mg_state" @change='userStatusChange(scope.row)'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini"
          @click="rebuildData(scope.row.id)">
          </el-button>

          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteData(scope.row.id)">

          </el-button>
         
          <!-- 分配角色按钮 -->
          <el-tooltip effect="dark" content="超级管理员" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="assignAuthority(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>   
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClose">

      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="userFormRules" ref="addFormRef" label-width="80px" status-icon >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>

    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="rebuildDialogVisible"
      width="30%"
      @close="rebuildDialogClose">

      <!-- 内容主体区域 -->
      <el-form :model="rebuildFroms" :rules="userFormRules" ref="rebuildFormRef" label-width="80px" status-icon >
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="rebuildFroms.username" disabled ></el-input>
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="rebuildFroms.email"></el-input>
        </el-form-item>
        
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="rebuildFroms.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="rebuildDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rebuildDialogSet">确 定</el-button>
      </span>

    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignAuthoritydialogVisible"
      width="50%">
      <div>当前用户：{{assignRoles.username}}</div>
      <div>当前角色：{{assignRoles.role_name}}</div>
      <div>
          分配角色：
            <el-select v-model="selectRoleid" placeholder="请选择" @change="sss">
                <el-option
                v-for="item in roleListsd"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
                >
                </el-option>
            </el-select>
      </div>
        
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignAuthoritydialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoles">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</div>
  
</template>

<script>
export default {
  data() {

    // 验证邮箱规则
    var checkEmail =(rule, value, callback)=>{
      // 验证邮箱的正则表达式
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if(regEmail.test(value)){
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }

    //验证手机号码规则
    var mobile =(rule, value, mb)=>{
       // 验证手机号的正则表达式
      const regmobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if(regmobile.test(value)){
        return mb()
      }
      mb(new Error('请输入11位手机号码'))
    }
    return {

      // 获取用户列表的参数对象
      queryInfo:{
        query:'',

        //当前页数
        pagenum:1,

        //当前每页显示多少条数据
        pagesize:5
      },
      userList:[],
      total:0,

      // 控制添加用户对话框的显示与隐藏
      addDialogVisible:false,

      //控制修改用户对话框的显示与隐藏
      rebuildDialogVisible:false,

      // 添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },

      //修改用户的表单数据
      rebuildFroms:{
        username:'',
        email:'',
        mobile:'',
        id:''
      },

      // 添加用户的表单验证规则对象
      userFormRules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},{min:3,max:5,message:"用户名的长度在3-5个字符之间",trigger:'blur'}
          
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},{min:6,max:12,message:"用户名的长度在6-12个字符之间",trigger:'blur'}
        ],
        email:[
          {required:true,message:'请输入邮箱',trigger:'blur'},{validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          {required:true,message:'请输入手机号',trigger:'blur'},{validator:mobile,trigger:'blur'}
        ]
      },
      
      //控制分配角色对话框的显示隐藏
        assignAuthoritydialogVisible:false,
        
        //分配角色数据
        assignRoles:'',

        //所有角色数据列表
        roleListsd:[],

        //已选中的角色id值
        selectRoleid:''
    }
  },
  created(){
    this.getUserlist()
  },

  methods:{
      sss(){
          console.log(this.selectRoleid);
      },
    // 获取用户菜单
    async getUserlist(){
      const {data: res } = await this.$http.get('users',{params:this.queryInfo})
      // console.log(res);
      if(res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },

    //监听pagesize改变的事件
    handleSizeChange(newSize){
      // console.log(newSize);
      this.queryInfo.pagesize = newSize
      this.getUserlist()
    },

    //监听页码值改变的事件
    handleCurrentChange(newPage){
      // console.log(newPage);
      this.queryInfo.pagenum = newPage
      this.getUserlist()
    },

    //监听用户状态改变 (1)
    async userStatusChange(userInfo){
      const {data : res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      // console.log(res);
      if(res.meta.status != 200){
        userInfo.mg_state != userInfo.mg_state
        return this.$message.error('用户状态更新失败')
      }
      this.$message.success('更新用户状态成功')
    },
    
    //监听添加用户对话框的关闭事件
    addDialogClose(){
      this.$refs.addFormRef.resetFields()
    },

    //添加新用户的按钮
    addUser(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return
        // console.log(valid);
        const {data:res} = await this.$http.post('users',this.addForm)
      
        if(res.meta.status != 201){
          this.$message.error('添加用户失败')
      }

      this.$message.success("添加用户成功")

      //隐藏添加用户的对话框
      this.addDialogVisible = false

      //重新获取用户列表数据
      this.getUserlist()
      })
    },

    //点击修改用户信息
    async rebuildData(id){
      
      this.rebuildDialogVisible = true
      const {data:res} = await this.$http.get(`users/${id}`)
      
      if(res.meta.status !== 200) return this.$message.error('获取失败')
      this.rebuildFroms = res.data
    },

    //监听修改用户
    rebuildDialogClose(){
      this.$refs.rebuildFormRef.resetFields()
    },

    // 点击修改用户  
    rebuildDialogSet(){
      this.$refs.rebuildFormRef.validate(async valid=>{
        // console.log(this.$refs);    
        if(!valid) return this.$message.error('校验失败')
        let id = this.rebuildFroms.id
        const {data: res} = await this.$http.put(`users/${id}`,this.rebuildFroms)
        if(res.meta.status != 200) return this.$message.error('修改失败')
        this.rebuildDialogVisible =false
        this.$message.success('修改成功')
        this.getUserlist()
      })
    },

    //点击删除用户数据
    async deleteData(id){
      const {data:res} = await this.$http.delete(`users/${id}`)
      // console.log(res);
      if(res.meta.status != 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getUserlist()
    },

    //点击分配用户权限按钮
    async assignAuthority(assign){
        this.assignRoles = assign
        const {data:res} = await this.$http.get('roles')
        console.log(res);
        if(res.meta.status != 200) {
            return this.$message.error('获取失败')
        } 
        this.roleListsd = res.data
        this.$message.success('获取成功')

        this.assignAuthoritydialogVisible = true
     
    },

    //点击按钮，分配角色
    async saveRoles(){
        if(!this.selectRoleid){
            return this.$message.error('请选择要分配的角色')
        }

        const {data:res}=await this.$http.put(`users/${this.assignRoles.id}/role`,
        {
            rid:this.selectRoleid
        })
        console.log(this.roleListsd);
        console.log(this.assignRoles);
        console.log(this.selectRoleid);
        if(res.meta.status != 200) {
            return this.$message.error('获取失败')
        }
        this.$message.success('获取成功')
        this.getUserlist()
        this.assignAuthoritydialogVisible = false
    }
  }
}
</script>

<style>

</style>