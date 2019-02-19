<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!-- 1.0 导航面包屑 -->
        <my-breadcrumb level1="商品管理" level2="分类参数"></my-breadcrumb>
      </el-col>
    </el-row>
    <!-- 2.0 级联选择器 -->
    <el-cascader
      :options="options"
      :props="defaultProps"
      @change="categoryChange"
      :show-all-levels="false"
      v-model="selectedOptions"
    ></el-cascader>
    <!-- 3.0 Tabs -->
    <el-tabs v-model="type" @tab-click="tabClick" type="border-card">
      <el-tab-pane label="动态参数" name="dynamic">
        <!-- 添加按钮 -->
        <el-button type="success" plain @click="dialogVisible4AddDynamicParams=true">添加动态参数</el-button>
        <el-table :data="dynamicParams" stripe border style="width: 100%">
          <el-table-column type="expand">
            <!-- 此时这里的作用域插槽
          scope.row rolesList中遍历到的每一行的数据,每个角色的数据
          scope.column 这一列
          scope.$index 遍历到每一行数据的索引
            -->
            <template slot-scope="scope">
              <!-- 具体列表 -->
              <el-tag
                :key="index"
                v-for="(tag,index) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="deleteAttrVal(index,scope.row)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="addDynamicParamsValue(scope.row)"
                @blur="hideInput(scope.row)"
                placeholder="按回车添加属性"
              ></el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(scope.row)"
              >+ 添加值</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="500"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                plain
                @click="editDynamicParams(scope.row)"
              ></el-button>
              <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                plain
                @click="deleteDynamicParams(scope.row.attr_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="static">
        <!-- 添加按钮 -->
        <el-button type="success" plain @click="dialogVisible4AddStaticParams=true">添加静态属性</el-button>
        <el-table :data="staticProperties" stripe border style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="250"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="250"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-edit"
                type="primary"
                size="mini"
                plain
                @click="editStaticParams(scope.row)"
              ></el-button>
              <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                plain
                @click="deleteStaticParams(scope.row.attr_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 4.0 添加动态参数对话框 -->
    <el-dialog title="添加动态参数" :visible.sync="dialogVisible4AddDynamicParams" width="50%">
      <el-form
        :model="dynamicParamsObj"
        :rules="rules"
        ref="addDynamicParamsForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="dynamicParamsObj.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4AddDynamicParams = false">取 消</el-button>
        <el-button type="primary" @click="submitAddDynamicParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 5.0 修改动态参数对话框 -->
    <el-dialog title="修改动态参数" :visible.sync="dialogVisible4EditDynamicParams" width="50%">
      <el-form
        :model="dynamicParamsObj"
        :rules="rules"
        ref="editDynamicParamsForm"
        label-width="100px"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="dynamicParamsObj.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4EditDynamicParams = false">取 消</el-button>
        <el-button type="primary" @click="submitEditDynamicParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 6.0 添加静态属性对话框 -->
    <el-dialog title="添加静态属性" :visible.sync="dialogVisible4AddStaticParams" width="50%">
      <el-form
        :model="editStaticParamsObj"
        :rules="rules"
        ref="addStaticParamsForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="editStaticParamsObj.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="参数值" prop="attr_vals">
          <el-input v-model="editStaticParamsObj.attr_vals"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4AddStaticParams = false">取 消</el-button>
        <el-button type="primary" @click="submitAddStaticParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 7.0 修改静态属性对话框 -->
    <el-dialog title="修改静态属性" :visible.sync="dialogVisible4EditStaticParams" width="50%">
      <el-form
        :model="editStaticParamsObj"
        :rules="rules"
        ref="editStaticParamsForm"
        label-width="100px"
      >
        <el-form-item label="属性名称" prop="attr_name">
          <el-input v-model="editStaticParamsObj.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="attr_vals">
          <el-input v-model="editStaticParamsObj.attr_vals"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4EditStaticParams = false">取 消</el-button>
        <el-button type="primary" @click="submitEditStaticParams">确 定</el-button>
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
      options: [], //分类数据
      defaultProps: {
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      },
      type: 'dynamic',
      // selectedOptions:[1,3,6]
      selectedOptions: [],
      thirdLevelId: 0,
      dynamicParams: [], //动态参数的数组
      staticProperties: [], //静态属性的数组
      dialogVisible4AddDynamicParams: false,
      dialogVisible4AddStaticParams: false,
      dialogVisible4EditDynamicParams: false,
      dialogVisible4EditStaticParams: false,
      dynamicParamsObj: {
        attr_name: '',
        attr_id: ''
      },
      editStaticParamsObj: {
        attr_name: '',
        attr_vals: '',
        attr_sel: 'only'
      },
      rules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        attr_vals: [
          { required: true, message: '请输入属性值', trigger: 'blur' }
        ]
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getCategoriesData()
  },
  methods: {
    getCategoriesData() {
      this.$axios
        .get('categories', {
          params: {
            type: 3
          }
        })
        .then(response => {
          console.log(response)

          //赋值
          this.options = response.data.data
          //默认选中
          const firstId = response.data.data[0].cat_id
          const secondId = response.data.data[0].children[0].cat_id
          const thirdId = response.data.data[0].children[0].children[0].cat_id

          this.selectedOptions = [firstId, secondId, thirdId]

          this.thirdLevelId = thirdId
          switch (this.type) {
            case 'dynamic':
              this.getThreeLevelDynamicParams()
              break
            case 'static':
              this.getThreeLevelStaticProperty()
              break

            default:
              break
          }
        })
    },
    //Tabs 切换栏事件
    tabClick(val) {
      this.type = val.name
      switch (this.type) {
        case 'dynamic':
          this.getThreeLevelDynamicParams()
          break
        case 'static':
          this.getThreeLevelStaticProperty()
          break

        default:
          break
      }
    },
    //当我们的级联菜单发生变化
    categoryChange(val) {
      console.log(val)
      if (val.length < 3) {
        this.$message.error('必须选择三级分类才能查到数据哦~')
        return
      }

      //给三级id赋值
      this.thirdLevelId = val[2]
      switch (this.type) {
        case 'dynamic':
          this.getThreeLevelDynamicParams()
          break
        case 'static':
          this.getThreeLevelStaticProperty()
          break
        default:
          break
      }
    },
    //获取三级分类的动态参数
    getThreeLevelDynamicParams() {
      // console.log('动态参数' + this.thirdLevelId)
      this.$axios
        .get(`categories/${this.thirdLevelId}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        .then(res => {
          res.data.data.forEach(item => {
            if (item.attr_vals.trim().length === 0) {
              item.attr_vals = []
            } else {
              item.attr_vals = item.attr_vals.split(',')
            }

            item.inputVisible = false
            item.inputValue = ''
          })
          // 给动态参数数组赋值
          this.dynamicParams = res.data.data
        })
    },
    //获取三级分类的静态参数
    getThreeLevelStaticProperty() {
      // console.log('静态参数' + this.thirdLevelId)
      this.$axios
        .get(`categories/${this.thirdLevelId}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        .then(res => {
          this.staticProperties = res.data.data
        })
    },
    //添加动态参数
    submitAddDynamicParams() {
      this.$refs.addDynamicParamsForm.validate(valid => {
        if (valid) {
          this.$axios
            .post(`categories/${this.thirdLevelId}/attributes`, {
              attr_name: this.dynamicParamsObj.attr_name,
              attr_sel: 'many'
            })
            .then(res => {
              if (res.data.meta.status === 201) {
                //隐藏对话框
                this.dialogVisible4AddDynamicParams = false
                //提示
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                // 重新查询
                this.getThreeLevelDynamicParams()
              }
            })
        }
      })
    },
    //弹出动态参数修改对话框
    editDynamicParams(dynamicParams) {
      this.dynamicParamsObj.attr_id = dynamicParams.attr_id
      this.$axios
        .get(
          `categories/${this.thirdLevelId}/attributes/${dynamicParams.attr_id}`,
          {
            attr_sel: 'many'
          }
        )
        .then(res => {
          if (res.data.meta.status === 200) {
            //提示
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.dynamicParamsObj.attr_name = res.data.data.attr_name

            this.dialogVisible4EditDynamicParams = true
          }
        })
    },
    //修改提交动态参数
    submitEditDynamicParams() {
      this.$refs.editDynamicParamsForm.validate(valid => {
        if (valid) {
          this.$axios
            .put(
              `categories/${this.thirdLevelId}/attributes/${
                this.dynamicParamsObj.attr_id
              }`,
              {
                attr_name: this.dynamicParamsObj.attr_name,
                attr_sel: 'many'
              }
            )
            .then(res => {
              if (res.data.meta.status === 200) {
                this.dialogVisible4EditDynamicParams = false

                this.getThreeLevelDynamicParams()

                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
              }
            })
        }
      })
    },
    //删除动态参数
    deleteDynamicParams(attr_id) {
      this.$axios
        .delete(`categories/${this.thirdLevelId}/attributes/${attr_id}`)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.getThreeLevelDynamicParams()

            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
          }
        })
    },
    //添加静态属性
    submitAddStaticParams() {
      this.$refs.addStaticParamsForm.validate(valid => {
        if (valid) {
          this.$axios
            .post(
              `categories/${this.thirdLevelId}/attributes`,
              this.editStaticParamsObj
            )
            .then(res => {
              if (res.data.meta.status === 201) {
                //隐藏对话框
                this.dialogVisible4AddStaticParams = false
                //提示
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                // 重新查询
                this.getThreeLevelStaticProperty()
              }
            })
        }
      })
    },
    //弹出修改静态属性对话框
    editStaticParams(obj) {
      this.attr_id = obj.attr_id

      this.editStaticParamsObj.attr_name = obj.attr_name
      this.editStaticParamsObj.attr_vals = obj.attr_vals

      this.dialogVisible4EditStaticParams = true
    },
    //提交静态属性
    submitEditStaticParams() {
      this.$refs.editStaticParamsForm.validate(valid => {
        if (valid) {
          this.$axios
            .put(
              `categories/${this.thirdLevelId}/attributes/${this.attr_id}`,
              this.editStaticParamsObj
            )
            .then(res => {
              console.log(res)

              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })

                this.dialogVisible4EditStaticParams = false
                // 刷新静态属性列表
                this.getThreeLevelStaticProperty()
              }
            })
        }
      })
    },
    //删除静态属性
    deleteStaticParams(attr_id) {
      this.$confirm('删除该属性, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //删除的逻辑
          this.$axios
            .delete(`categories/${this.thirdLevelId}/attributes/${attr_id}`)
            .then(response => {
              if (response.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: response.data.meta.msg
                })
                this.getThreeLevelStaticProperty()
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

    //失去焦点的时候让我们的input框隐藏
    hideInput(params) {
      params.inputVisible = false
    },
    //我们的input框显示
    showInput(obj) {
      //我们更改了模型之后,Vue会重新渲染
      obj.inputVisible = true
      //等我们的页面完全渲染完毕之后,我才能拿到dom操作
      this.$nextTick(() => {
        //它的执行时机是,当我们的所有DOM元素渲染完毕,Vue框架会自动调用这个回调函数

        this.$refs.saveTagInput.focus()
      })
    },
    //删除动态属性的某个值
    deleteAttrVal(index, params) {
      //删除params中的attr_vals
      params.attr_vals.splice(index, 1)
      //调用接口去更新动态参数的值
      this.addOrRemoveDynamicParamsValue(params)
    },
    //添加某个动态属性的值
    addDynamicParamsValue(params) {
      if (params.inputValue.trim().length === 0) {
        this.$message({
          message: '输入内容之后，才能添加哦',
          type: 'warning'
        })
        return
      }
      //给当前数组添加内容,就会导致视图发生变化
      params.attr_vals.push(params.inputValue)
      //添加动态参数的值
      this.addOrRemoveDynamicParamsValue(params)
    },
    //添加或是删除动态参数的值
    addOrRemoveDynamicParamsValue(params) {
      this.$axios
        .put(`categories/${this.thirdLevelId}/attributes/${params.attr_id}`, {
          attr_name: params.attr_name,
          attr_sel: 'many',
          attr_vals: params.attr_vals.join(',')
        })
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              message: res.data.meta.msg,
              type: 'success'
            })
            //清空我们的params的inputValue的值 ,让inputVisible
            params.inputVisible = false
            params.inputValue = ''
          }
        })
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 150px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>