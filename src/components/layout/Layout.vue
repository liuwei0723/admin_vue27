<template>
  <el-container>
    <el-aside width="auto">
      <div class="logo"></div>
      <el-menu
        router
        :default-active = "defaultActive"
        :collapse="isCollapse"
        :unique-opened="true"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-submenu v-for="item in menus" :key='item.id' :index="item.id+''">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{item.authName}}</span>
          </template>

          <el-menu-item v-for="subitem in item.children" :key='subitem.id' :index="'/layout/'+subitem.path">
            <i class="el-icon-menu"></i>{{subitem.authName}}
          </el-menu-item>
        </el-submenu>
        
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 字体图标 -->
        <i @click="toggleMenu" style="font-size:30px;color:orange;" class="iconfont icon-webicon03"></i>
        <div class="stitle">电商后台管理系统</div>
        <a href="javascript:;" @click="logout" class="logoutbtn">退出</a>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.btnsize {
  font-size: 36px;
  color: #989898;
  cursor: pointer;
  line-height: 60px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-container {
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: left;
  line-height: 60px;
}
.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: left;
  display: block;
}
.el-menu {
  border-right: 0;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: left;
  overflow: '';
}
.logoutbtn {
  position: absolute;
  right: 10px;
  color: orange;
}
.el-header {
  background-color: #545c64;
}
.logo {
  height: 60px;
  background: url(../../assets/logo.png);
  background-size: cover;
  background-color: #989898;
}
.stitle {
  position: absolute;
  font-size: 28px;
  overflow: hidden;
  width: 300px;
  color: #fff;
  left: 600px;
  top: 0px;
}
</style>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menus: [], //登录用户的菜单列表
      defaultActive: "/layout/users" //给defaultActive设置了一个默认值
    }
  },
  created() {
    //设置让当前的路径高亮
    this.defaultActive = this.$route.path
    this.getMenus()
  },
  methods: {
    toggleMenu() {
      this.isCollapse = !this.isCollapse
    },
    logout() {
      this.$confirm('是否确定退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('mytoken')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    },
    getMenus(){
      this.$axios.get('menus').then(res=>{
        this.menus = res.data.data
      })
    }
  }
}
</script>