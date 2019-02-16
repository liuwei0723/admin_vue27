<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!-- 1.0 导航面包屑 -->
        <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
      </el-col>
    </el-row>
    <!-- 2.0 添加角色 -->
    <el-button type="success" plain @click="dialogVisible4Add=true">添加角色</el-button>
    <!-- 3.0 角色列表 -->
    <el-table :data="rolesList" stripe border style="width: 100%">
      <el-table-column type="expand">
        <!-- 此时这里的作用域插槽
          scope.row rolesList中遍历到的每一行的数据,每个角色的数据
          scope.column 这一列
          scope.$index 遍历到每一行数据的索引
        -->
        <template slot-scope="scope">
          <!-- 具体列表 -->
          <el-row v-for="item in scope.row.children" :key="item.id" closable>
            <!-- 左边占3列,一级权限 -->
            <el-col :span="3">
              <el-tag
                closable
                @close="deleteRights(scope.$index,scope.row.id,item.id)"
              >{{item.authName}}</el-tag>
              <i v-if="item.children.length > 0" class="el-icon-arrow-right arrow"></i>
            </el-col>
            <!--右边占21列,二级权限,三级权限 -->
            <el-col :span="21">
              <el-row class="authlist" v-for="subitem in item.children" :key="subitem.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success"
                    @close="deleteRights(scope.$index,scope.row.id,subitem.id)"
                  >{{subitem.authName}}</el-tag>
                  <i v-if="subitem.children.length > 0" class="el-icon-arrow-right arrow"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    @close="deleteRights(scope.$index,scope.row.id,third.id)"
                    v-for="third in subitem.children"
                    :key="third.id"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
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
          <el-button
            size="mini"
            icon="el-icon-check"
            type="warning"
            plain
            @click="grantRight(scope.row)"
          ></el-button>
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
    <el-dialog title="修改角色" :visible.sync="dialogVisible4Edit" width="50%">
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
    <!-- 6.0 展示权限的对话框  -->
    <el-dialog title="给角色授权" :visible.sync="dialog4GrantVisible" width="50%">
      <el-tree
        ref="grantTree"
        :data="treeRightsList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog4GrantVisible = false">取 消</el-button>
        <el-button type="primary" @click="sumbitGrant">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>




<script>
//导入
import MyBreadcrumb from '../subcomponents/MyBreadcrumb'

export default {
  components: {
    // "my-breadcrumb":MyBreadcrumb
    MyBreadcrumb
  },
  data() {
    return {
      rolesList: [], //角色列表
      treeRightsList: [], // 权限树形数据
      checkedKeys: [], //设置选中的数据
      dialogVisible4Add: false, //新增角色标识符
      dialogVisible4Edit: false, //修改角色标识符
      dialog4GrantVisible: false, //分配角色标识符
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
      },
      defaultProps: {
        // 配置对应关系
        children: 'children',
        label: 'authName'
      },
      roleId: null //角色ID
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
        // console.log(res)

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
    },
    //删除角色下面的权限
    deleteRights(index, roleId, rightId) {
      this.$axios.delete(`roles/${roleId}/rights/${rightId}`).then(res => {
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success'
          })
          //重新给角色权限赋值
          this.rolesList[index].children = res.data.data
        }
      })
    },
    //弹出修改权限对话框
    grantRight(role) {
      this.roleId = role.id
      // 设置选中的数据
      this.checkedKeys = []
      if (role.children && role.children.length > 0) {
        role.children.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(subitem => {
              if (subitem.children && subitem.children.length > 0) {
                subitem.children.forEach(last => {
                  this.checkedKeys.push(last.id)
                })
              }
            })
          }
        })
      }
      this.$axios.get(`rights/tree`).then(res => {
        this.treeRightsList = res.data.data
        console.log(res)

        // 显示
      this.dialog4GrantVisible = true
      })
      
    },
    // 确认授权
    sumbitGrant() {
      //获取全选中的key
      const checkedKeys = this.$refs.grantTree.getCheckedKeys()
      //获取半选中的key
      const halfCheckedKeys = this.$refs.grantTree.getHalfCheckedKeys()
      // 需要提交给后台的全部节点
      const lastKeys = checkedKeys.concat(halfCheckedKeys)
      //这是最终需要提交给后台的字符串,里面包含选中和半选中的key
      const rids = lastKeys.join(',')
      //给角色赋值
      this.$axios
        .post(`roles/${this.roleId}/rights`, {
          rids: rids
        })
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              message: res.data.meta.msg,
              type: 'success'
            })
            // 关闭对话框
            this.dialog4GrantVisible = false
            //刷新列表
            this.getRolesListData()
          }
        })
    }
  }
}
</script>


<style scoped>
.el-tag {
  margin-left: 5px;
  margin-top: 5px;
}
.authlist {
  border-top: solid 1px #d3dce6;
  padding-bottom: 5px;
}
.arrow {
  font-size: 16px;
  font-weight: bold;
}
</style>