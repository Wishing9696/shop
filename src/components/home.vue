<template>
  <el-container class="home_continer">
    <!-- 头部区域 -->
    <el-header>
      <div class="img_title">
        <img src="../assets/logo.png" alt="" />
        <span class="productName">电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <!-- 页面主题 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">

        <!-- 侧边栏菜单区域 -->
        <div class="toggle_btns" @click="toggleCollapse">|||</div>
        <el-menu
          
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          unique-opened
          :collapse='isCollapse'
          :collapse-transition="false"
          :default-active="activePath"
          router
          
        >
        <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menusList" :key="item.id"> 
                <template slot="title">
                <i :class="iconsp[item.id]"></i>
                <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="'/' + subList.path" v-for="subList in item.children" :key="subList.id" @click="savePath('/' + subList.path)">
                <i class="el-icon-menu"></i>
                <span slot="title">{{subList.authName}}</span>
                </el-menu-item>
            </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面主体 -->
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    data() {
        return {
            isCollapse:false,
            menusList:[],
            iconsp:{
                '125':'iconfont icon-yonghu',
                '103':'iconfont icon-quanxian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-dingdan',
                '145':'iconfont icon-data'
            },
            activePath:''   
        }
    },
    created(){
        this.getList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
  methods: {
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getList(){
        const {data:res} = await this.$http.get("menus")
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menusList = res.data
        // console.log(res);
    },
    //点击折叠导航栏
    toggleCollapse(){
        this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    savePath(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath=activePath
    }
  },
};
</script>

<style lang="scss" scoped>
.home_continer {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  img {
    width: 60px;
  }
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
//   background-color: pink;
    .el-menu{
        border-right: none;
    }
}
.iconfont{
    margin-right: 10px;
}
.el-main {
  background-color: #eaedf1;
}
.toggle_btns{
    background-color: #4a5064;
    color: #fff;
    line-height: 24px;
    font-size: 10px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}

</style>