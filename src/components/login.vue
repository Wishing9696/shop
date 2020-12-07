<template>
    <div class="continer">
            <div class="Effect">
                <div class="login_box">
                <!-- 头像 -->
                <div class="avter_box">
                    <img src="../assets/logos.png" alt="">
                </div>
                <!-- 标题 -->
                <div class="homeTitle">
                    后台管理系统
                </div>
                <!-- 登录失败 -->
                <el-dialog
                title="错误提醒:"
                :visible.sync="loginErrorDialogVisible"
                width="30%"
                custom-class="loginErrorss">
                <div class="loginErrorss">请确认账号密码输入无误</div>
                <span slot="footer">
                    <el-button type="primary" @click="loginErrorDialogVisible = false">确 定</el-button>
                </span>
                </el-dialog>
                <!-- 表单 -->
                <el-form :model="from" :rules="rules" label-width="0px" class="login-form" ref="loginFromRef">
                    <!-- 用户名 -->
                    <el-form-item prop="username">
                        <el-input v-model="from.username" prefix-icon="iconfont icon-yonghu"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item prop="password" >
                        <el-input v-model="from.password" prefix-icon="iconfont icon-mima" type="password"></el-input>
                    </el-form-item>
                    <!-- 按钮 -->
                    <el-form-item class="btns_box">
                        <el-button  type="primary" @click="loginFrom">登录</el-button>
                        <el-button type="info"  @click="resetLoginFrom">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 登录错误提示对话框显示与隐藏
            loginErrorDialogVisible:false,
            //这是登录数据绑定的数据对象
            from:{
                username :'',
                password :''
            },
            //表单验证规则对象
            rules:{
                // 用户名验证规则
                userName:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                //密码验证规则
                passWord:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        // 全局监听用户按下回车事件
        let that = this;
        document.onkeydown =function(e){
        e = window.event || e;
        if(that.$route.path=='/login'&&(e.code=='Enter'||e.code=='enter')){//验证在登录界面和按得键是回车键enter
            that.loginFrom('loginFrom');//登录函数
        }
    }
    },
    methods:{
        // 点击重置按钮，重置from表单 resetFields(重置方法)
        resetLoginFrom(){
            // console.log(this);
            this.$refs.loginFromRef.resetFields()
        },
        //点击登录，表单数据验证 validate（预验证方法）
        loginFrom(){
            this.$refs.loginFromRef.validate(async(vaild)=>{
                console.log(vaild);
                if(!vaild)return;
                const {data:res} =await this.$http.post('login',this.from)
                console.log(res);
                if(res.meta.status !== 200){
                    this.loginErrorDialogVisible = true
                    return;
                }
                this.$message.success('登录成功')   
                // 将登录成功之后的token ，保存到客户端的sessionStorage中
                window.sessionStorage.setItem("token",res.data.token)
                // 通过编程式导航跳转到后台主页
                this.$router.push('/home') 
            })
        }
    }
}
</script>
<style lang="scss" scoped>
// scoped 控制样式生效区间

.continer{
    background-image: url(../assets/bgimg.jpeg);
    height: 100vh;
    width: 100%;
    background-size: cover;
    .loginErrorss{
        color: red;
        text-align: center;
    }
    .homeTitle{
        position: absolute;
        top:80px;
        left: 168px;
        font-family: '微软雅黑';
        color: 	gray;
    }
    .login_box::before{
        content: '';
        position: absolute;
        top: 0; bottom: 0;
        left: 0; right: 0;
        filter: blur(20px);
        z-index: -1;
        margin: -30px;
    }
    .login_box{
        position: absolute;
        top: 0; bottom: 0;
        left: 0; right: 0;
        width: 430px;
        height: 320px;
        line-height: 2;
        margin: auto;
        border-radius: 5px;
        background: rgba(255, 255, 255, .3);
        box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
        .avter_box{
            height: 130px;
            width: 130px;
            border-radius: 50%;
            border: 1px solid #eee;
            overflow: hidden;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #fff;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }
}
.login-form{
    position: absolute; 
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns_box{
    display: flex;
    justify-content: flex-end;
    z-index: 1000;
}
</style>