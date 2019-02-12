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
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button style="margin-left:5px;" type="success" plain @click="dialogVisible4Add=true">添加用户</el-button>
    <!-- 3.0 用户列表 -->
    <el-table :data="userList" stripe border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
      <el-table-column label="用户状态" width="100">
        <template slot-scope="scope">
          <!-- scope.row 就拿到当前遍历的那一行数据 -->
          <el-switch v-model="scope.row.mg_state"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" size="mini" plain></el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger" plain></el-button>
          <el-button size="mini" icon="el-icon-check" type="warning" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4.0分页条 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 5.0 新增用户的对话框 -->
    <el-dialog title="新增用户" :visible.sync="dialogVisible4Add" width="50%">
      <el-form :model="addUserObj" :rules="rules" ref="addUserRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserObj.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserObj.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserObj.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUserObj.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Add = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
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
// import axios from 'axios'
export default {
  data() {
    return {
      query: '', //搜索关键字
      pagenum: 1, //页码
      pagesize: 5, //每页显示多少条
      userList: [], //用户列表
      total: 0, //总条数
      dialogVisible4Add: false, //刚开始是隐藏
      addUserObj: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'}
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'}
        ]
      }
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
      this.$axios
        .get(`users`, {
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
            query: this.query
          }
        })
        .then(res => {
          //赋值给模型
          this.userList = res.data.data.users
          // console.log(this.userList);
          //赋值总条数
          this.total = res.data.data.total
        })
    },
    //到页面改变的时候触发
    handleSizeChange(pagesize) {
      this.pagesize = pagesize
      this.getUserListData()
    },
    //到页码改变时触发
    handleCurrentChange(pagenum) {
      this.pagenum = pagenum
      this.getUserListData()
    },
    addUser() {
      //拿到el-form表单
      this.$refs.addUserRef.validate(valid => {
        if (valid) {
          //验证通过
          this.$axios
            .post(
              `users`,
              this.addUserObj
            )
            .then(res => {
              if (res.data.meta.status === 201) {
                //隐藏对话框
                this.dialogVisible4Add = false
                //提示
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                // 重新查询列表
                this.getUserListData()
              }
            })
        }
      })
    }
  }
}
</script>