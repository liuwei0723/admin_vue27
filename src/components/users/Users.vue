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
          <el-switch
            @change="changeState(scope.row.mg_state,scope.row.id)"
            v-model="scope.row.mg_state"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            plain
            @click="editUser(scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            plain
            @click="deleteUser(scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            icon="el-icon-check"
            type="warning"
            plain
            @click="assignRole(scope.row)"
          ></el-button>
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
    <!-- 6.0 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="dialogVisible4Edit" width="40%">
      <el-form :model="editUserObj" :rules="rules" ref="editUserObj" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input style="width:40%" disabled v-model="editUserObj.username"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserObj.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUserObj.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Edit = false">取 消</el-button>
        <el-button type="primary" @click="editUser2">确 定</el-button>
      </span>
    </el-dialog>
    <!--7.0 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogVisible4Grant" width="50%">
      <el-form :model="editUserObj" :rules="rules" ref="editUserObj" label-width="120px">
        <el-form-item label="当前的用户名：">{{grantUserName}}</el-form-item>
        <el-form-item label="请选择角色：">
          <el-select v-model="roleName" placeholder="请选择" @change="selectRole">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Grant = false">取 消</el-button>
        <el-button type="primary" @click="submitAssignRole">确 定</el-button>
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
      dialogVisible4Edit: false, //刚开始是隐藏
      dialogVisible4Grant: false, //分配角色
      addUserObj: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserObj: {
        //修改用户信息时候的对象
      },
      grantUserName: '', // 被授权的用户名
      roleId: -1, // 选中的角色id
      roleName: '', // 之前授权的角色名称
      roleList: [], //角色列表
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  // 当Users组件的实例创建完成之后，会自动执行该函数
  created() {
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
    //新增用户
    addUser() {
      //拿到el-form表单
      this.$refs.addUserRef.validate(valid => {
        if (valid) {
          //验证通过
          this.$axios.post(`users`, this.addUserObj).then(res => {
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
    },
    //更新状态
    changeState(state, userId) {
      this.$axios.put(`users/${userId}/state/${state}`).then(response => {
        if (response.data.meta.status === 200) {
          this.$message({
            message: response.data.meta.msg,
            type: 'success'
          })
        }
      })
    },
    //查询用户信息
    editUser(userId) {
      this.$axios.get(`users/${userId}`).then(response => {
        //赋值给模型,弹出修改框
        this.editUserObj = response.data.data
        //弹出修改框
        this.dialogVisible4Edit = true
      })
    },
    //修改用户信息
    editUser2() {
      this.$axios
        .put(`users/${this.editUserObj.id}`, this.editUserObj)
        .then(response => {
          // console.log(response);
          if (response.data.meta.status === 200) {
            this.$message({
              message: response.data.meta.msg,
              type: 'success'
            })
          }
          //关闭修改框
          this.dialogVisible4Edit = false
          //刷新列表
          this.getUserListData()
        })
    },
    //删除单个用户
    deleteUser(userId) {
      this.$confirm('删除该用户, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //删除的逻辑
          this.$axios.delete(`users/${userId}`).then(response => {
            console.log(response)
            if (response.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: response.data.meta.msg
              })
              this.pagenum = 1
              this.getUserListData()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //分配角色
    assignRole(user) {
      this.grantUserName = user.username
      this.grantUserId = user.id
      this.roleId = user.role_id
      this.roleName = user.role_name
      //获取所有角色列表
      this.$axios.get(`roles`).then(response => {
        //赋值给模型,弹出修改框
        this.roleList = response.data.data
        //弹出修改框
        this.dialogVisible4Grant = true
      })
    },
    //修改角色
    selectRole(roleId) {
      this.roleId = roleId
    },
    //提交分配角色
    submitAssignRole() {
      if (!this.roleId) {
        this.$message({
          message: '请选择角色!',
          type: 'warning'
        })
        return
      }
      this.$axios.put(`users/${this.grantUserId}/role`,{
        rid:this.roleId
      }).then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          // 关闭对话框
          this.dialogVisible4Grant = false
          // 重新查询
          this.getUserListData()
          // 提示
          this.$message({
            message: res.data.meta.msg,
            type: 'success'
          })
        }
      })
    }
  }
}
</script>