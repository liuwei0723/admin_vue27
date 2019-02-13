<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!-- 1.0 导航面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- 2.0 添加角色 -->
    <el-button type="success" plain @click="dialogVisible4Add=true">添加角色</el-button>
    <!-- 3.0 角色列表 -->
    <el-table :data="rolesList" stripe border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <!-- 具体列表 -->
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="400"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            plain
            @click="editRole(scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            plain
            @click="deleteRole(scope.row.id)"
          ></el-button>
          <el-button size="mini" icon="el-icon-check" type="warning" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4.0 新增角色的对话框 -->
    <el-dialog title="新增角色" :visible.sync="dialogVisible4Add" width="50%">
      <el-form :model="addRoleObj" :rules="rules" ref="addRoleRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleObj.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleObj.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Add = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 5.0 修改角色的对话框 -->
    <el-dialog title="新增角色" :visible.sync="dialogVisible4Edit" width="50%">
      <el-form :model="editRoleObj" :rules="rules" ref="addRoleRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleObj.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleObj.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Edit = false">取 消</el-button>
        <el-button type="primary" @click="editRole2">确 定</el-button>
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
</style>


<script>
export default {
  data() {
    return {
      rolesList: [], //角色列表
      dialogVisible4Add: false, //新增角色标识符
      dialogVisible4Edit: false, //修改角色标识符
      addRoleObj: {
        roleDesc: '', //角色描述
        roleName: '' //角色名称
      },
      editRoleObj: {
        roleDesc: '', //角色描述
        roleName: '' //角色名称
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
      }
    }
  },
  // 当Users组件的实例创建完成之后，会自动执行该函数
  created() {
    this.getRolesListData()
  },
  methods: {
    //发送请求,获取角色列表数据
    getRolesListData() {
      this.$axios.get(`roles`).then(res => {
        //赋值给模型
        this.rolesList = res.data.data
      })
    },
    //新增角色
    addRole() {
      //拿到el-form表单
      this.$refs.addRoleRef.validate(valid => {
        if (valid) {
          //验证通过
          this.$axios.post(`roles`, this.addRoleObj).then(res => {
            console.log(res)

            if (res.data.meta.status === 201) {
              //隐藏对话框
              this.dialogVisible4Add = false
              //提示
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              // 重新查询列表
              this.getRolesListData()
            }
          })
        }
      })
    },
    //修改之前弹出对话框
    editRole(roleId) {
      this.$axios.get(`roles/${roleId}`).then(response => {
        this.editRoleObj = response.data.data
        this.dialogVisible4Edit = true
      })
    },

    //修改角色
    editRole2() {
      this.$axios
        .put(`roles/${this.editRoleObj.roleId}`, this.editRoleObj)
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
          this.getRolesListData()
        })
    },
    //删除角色
    deleteRole(roleId) {
      this.$confirm('删除该角色, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //删除的逻辑
          this.$axios.delete(`roles/${roleId}`).then(response => {
            console.log(response)
            if (response.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: response.data.meta.msg
              })
              this.getRolesListData()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>