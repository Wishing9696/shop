<template>
  <div>
      
      <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮区域 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="addUser">添加角色</el-button>
            </el-col>
        </el-row>

        <!-- 角色列表区域 -->
        <el-table :data="rolesList" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['bdbuttom',i1 === 0 ? 'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一级权限 -->
                        <el-col :span="5">
                            <el-tag closable @close="removeById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二级和三级 -->
                        <el-col :span="19" >
                            <el-row :class="[i2 === 0 ? '' : 'bdtop' , 'vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id"
                            >
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col> 

                                <el-col :span="18">
                                    <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" 
                                    closable @close="removeById(scope.row,item3.id)">
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- <pre>
                        {{scope.row}}

                    </pre> -->
                </template>
            </el-table-column>
            <!-- 下标列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editing(scope.row.id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteData(scope.row.id)">删除</el-button>
                    <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加用户对话框 -->
        <el-dialog
            title="添加角色"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClose">
            <!-- 内容主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" status-icon >
                <el-form-item label="用户名" prop="roleName">
                <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                
                <el-form-item label="权限" prop="roleDesc">
                <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="open">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑角色信息 -->
        <el-dialog
            title="编辑角色信息"
            :visible.sync="editingDialogVisible"
            width="50%"
            @close="editingDialogClose">
            <!-- 内容主体区域 -->
            <el-form :model="editingForm" :rules="editingFormRules" ref="editingFormRef" label-width="80px" status-icon >
                <el-form-item label="用户名" prop="roleName">
                <el-input v-model="editingForm.roleName"></el-input>
                </el-form-item>
                
                <el-form-item label="权限" prop="roleDesc">
                <el-input v-model="editingForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button @click="editingDialogClose">取 消</el-button>
                <el-button type="primary" @click="editingConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限 -->
        <el-dialog
        title="分配权限"
        :visible.sync="SetRightsdialogVisible"
        width="50%"
        @close="resetDefKeys">

        <!-- 树形控件 -->
        <el-tree :data="allShowDialog" :props="treeProps" show-checkbox node-key='id' default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="SetRightsdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="alowRights">确 定</el-button>
        </span>
        </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return {
            
            //获取角色列表
            rolesList:[],

            //控制用户对话框的显示与隐藏
            addDialogVisible:false,

            //编辑角色信息对话框的显示与隐藏
            editingDialogVisible:false,

            // 分配权限的显示与隐藏
            SetRightsdialogVisible:false,

            // 保存分配权限
            allShowDialog:[],

            //树形控件默认选中的（绑定key值）
            defKeys:[],

            //点击分配角色的时候将该角色的ID 存储到DATA中方便后续分配权限使用
            roleId:'',

            //树形控件绑定对象
            treeProps:{
                label:'authName',
                children: 'children'
            },

            //保存添加角色数据
            addForm:{
                roleName:'',
                roleDesc:''
            },

            //编辑角色信息数据
            editingForm:{
                roleId:'',
                roleName:'',
                roleDesc:''
            },
            
            // 添加角色的表单验证规则对象
            addFormRules:{
               roleName:[
                    {required:true,message:'请输入用户名',trigger:'blur'}],
               roleDesc:[
                    {required:true,message:'请输入角色描述',trigger:'blur'}]
            },

            //角色获取对话框规则验证
            editingFormRules:{
                roleName:[
                    {required:true,message:'请输入用户名',trigger:'blur'}],
                roleDesc:[
                    {required:true,message:'请输入角色描述',trigger:'blur'}]
            }
        } 

    },

    // 在打开页面后获取角色列表
    created(){
        this.getRolesList()
    },

    methods:{

        //获取角色列表数据
        async getRolesList(){
            const {data:res} = await this.$http.get('roles')
            console.log(res);
            if(res.meta.status !== 200 ){
                return this.$message.error('获取角色列表失败')
            }

            // 将获取到的数据挂载到自己的数据中
            this.rolesList = res.data
            // console.log('获取角色列表');
            // 提示获取数据成功
            // this.$message.success('获取角色列表成功')
        },

        //添加角色按钮方法
        addUser(){
            this.addDialogVisible = true
        },

        //关闭对话框时清除里面的数据
        addDialogClose(){
            this.$refs.addFormRef.resetFields()
        },

        //点击添加角色
         addUsers(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.post('roles',this.addForm)
                if(res.meta.status !== 201) return this.$message.error('请求添加角色失败')
                this.getRolesList()
                this.addDialogVisible=false
                this.$message.success('请求添加角色成功')
            })    
        },

        //添加角色再次确认
        open() {
            this.$confirm('此操作将添加角色, 是否继续?', '注意', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.addUsers() 
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消添加'
            });          
                this.addDialogVisible=false
            });
        },

        //编辑方法
        async editing(id){
            const {data:res} = await this.$http.get(`roles/${id}`)
            // console.log();
            if(res.meta.status !== 200) return this.$message.error('查询失败')
            this.editingForm = res.data
            this.editingDialogVisible = true
        },

        //监听编辑角色对话框消失时清除对话框数据
        editingDialogClose(){
            this.$refs.editingFormRef.resetFields()
            this.editingDialogVisible = false
        },

        //编辑角色信息确定按钮发送数据
        async editingConfirm(){
            let id = this.editingForm.roleId
            const {data:res} = await this.$http.put(`roles/${id}`,this.editingForm)
            if(res.meta.status !== 200) return this.$message.error('put失败')
            this.editingDialogVisible = false
            this.$message.success("put成功")
            this.getRolesList()
        },

        //点击删除角色信息
        deleteData(id){
            this.$confirm('此操作将删除角色, 是否继续?', '注意', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async() => {
                const {data:res} = await this.$http.delete(`roles/${id}`)
                if(res.meta.status !== 200) return this.$message.error('del失败')
                this.$message.success("del成功")
                this.getRolesList()
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '取消'
            });          
            });  
        },

        //根据ID删除对应的权限
        async removeById(roles,itemId){

            const confirmResult = await this.$confirm('此操作将删除角色权限, 是否继续?', '注意', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if(confirmResult !== 'confirm'){
                return this.$message.info('取消删除')
            }
            const {data :res } = await this.$http.delete(`roles/${roles.id}/rights/${itemId}`)
            if(res.meta.status !== 200){
                return this.$message.info('删除数据失败')
            }
            roles.children = res.data
            this.$message.success('删除成功')
        },

        // 点击权限分配按钮
        async showSetRightsDialog(role){
            console.log(role);
            //点击分配角色的时候将该角色的ID 存储到DATA中方便后续分配权限使用
            this.roleId = role.id
            // console.log(roleId);
            // 获取权限的数据
            const {data:res} = await this.$http.get('rights/tree')
            if(res.meta.status !==200) return this.$message.error('请求权限数据失败')
            
            //获取到的数据保存到allShowDialog中
            this.allShowDialog = res.data
            //递归获取三级节点的ID
            this.getLeafKeys(role,this.defKeys)
            
            

            this.SetRightsdialogVisible = true
        },
        
        //递归获取所有3及权限的ID
        getLeafKeys(node,arr){
            if(!node.children){
                return arr.push(node.id)
            }

            node.children.forEach(item=>
            this.getLeafKeys(item,arr))
        },
        
        //监听分配权限是否打开，实现关闭时重置默认列表
        resetDefKeys(){
            this.defKeys=[]
        },
        
        //点击为角色分配权限
        async alowRights(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedNodes(),
            ]
            const idStr = keys.join(',')
            const {data:res } = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
            if(res.meta.status !== 200){
                return this.$message.error('发送分配权限数据失败')
            }
            this.$message.success('发送分配权限数据成功')
            this.getRolesList()
            this.SetRightsdialogVisible = false
        }
    }
}

</script>

<style lang="scss" scope>

.el-tag{
    margin: 7px;
}

.bdtop{
    border-top: 1px solid #eee;
}

.bdbuttom{
    border-bottom:1px solid #eee;

}
.vcenter{
    display: flex;
    align-items: center;
}
</style>