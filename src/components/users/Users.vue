<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-input placeholder="请输入内容" v-model="query" class="search">
      <el-button  slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button style="margin-left:5px;" type="success" plain>添加用户</el-button>
    <!-- 3.0 用户列表 -->
    <el-table
      :data="userList"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色"
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="100"
      >
        <template slot-scope="scope">
          <!-- scope.row 就拿到当前遍历的那一行数据 -->
          <el-switch v-model="scope.row.mg_state">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            plain
          ></el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            plain
          ></el-button>
          <el-button
            size="mini"
            icon="el-icon-check"
            type="warning"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<style scoped>
.el-breadcrumb {
  background-color: #d3dce6;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
}
.search {
  width: 300px;
}

.el-pagination {
  background-color: #d3dce6;
  padding-top: 10px;
  height: 35px;
  line-height: 35px;
}
</style>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      query: '' ,//搜索关键字
      pagenum:1,    //页码
      pagesize:5,   //每页显示多少条
      userList:[]  //用户列表
    }
  },
  // 当Users组件的实例创建完成之后，会自动执行该函数
  created() {
    // console.log(1111)
    this.getUserListData()
  },
  methods: {
    //发送请求,获取用户列表数据
    getUserListData() {
         /**
       * 参数1：url
       * 参数2：url的参数 & 请求头
       */
      axios.get(`http://127.0.0.1:8888/api/private/v1/users`,{
          params:{
              pagenum:this.pagenum,
              pagesize:this.pagesize,
              query:this.query
          },
          //请求头
          headers:{
              Authorization:localStorage.getItem('mytoken')
          }
      }).then(res=>{
          //赋值给模型
          this.userList = res.data.data.users
          console.log(this.userList);
          
      })
    }
  }
}
</script>