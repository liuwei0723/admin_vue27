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
        <el-button type="success" plain @click="dialogVisible4Add1=true">添加动态参数</el-button>
        <el-table :data="dynamicParams" stripe border style="width: 100%">
          <el-table-column type="expand">
            <!-- 此时这里的作用域插槽
          scope.row rolesList中遍历到的每一行的数据,每个角色的数据
          scope.column 这一列
          scope.$index 遍历到每一行数据的索引
            -->
            <template slot-scope="scope">
              <!-- 具体列表 -->
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
                @click="editParams(scope.row.id)"
              ></el-button>
              <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                plain
                @click="deleteParams(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="static">
        <!-- 添加按钮 -->
        <el-button type="success" plain>添加静态属性</el-button>
        <el-table :data="staticProperties" stripe border style="width: 100%">
          <el-table-column type="expand">
            <!-- 此时这里的作用域插槽
          scope.row rolesList中遍历到的每一行的数据,每个角色的数据
          scope.column 这一列
          scope.$index 遍历到每一行数据的索引
            -->
            <template slot-scope="scope">
              <!-- 具体列表 -->
            </template>
          </el-table-column>
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
                @click="editParams(scope.row.id)"
              ></el-button>
              <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                plain
                @click="deleteParams(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 4.0 添加动态参数对话框 -->
    <el-dialog title="新增动态参数" :visible.sync="dialogVisible4Add1" width="50%">
      <el-form
        :model="addDynamicParamsObj"
        :rules="rules"
        ref="addDynamicParamsForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addDynamicParamsObj.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Add1 = false">取 消</el-button>
        <el-button type="primary" @click="submitAddDynamicParams">确 定</el-button>
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
      selectedOptions:[],
      thirdLevelId: 0,
      dynamicParams: [], //动态参数的数组
      staticProperties: [], //静态属性的数组
      dialogVisible4Add1:false,
      dialogVisible4Add2:false,
      dialogVisible4Edit1:false,
      dialogVisible4Edit2:false,
      addDynamicParamsObj:{
        attr_name:'',
        attr_id:'',
      },
      rules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }

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
          console.log(response);
          
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
       console.log(val);
      if(val.length<3){
        this.$message.error('必须选择三级分类才能查到数据哦~');
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
          console.log(res);
          
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
          
          console.log(res.data);
          this.staticProperties = res.data.data
        })
    },
    //添加动态参数
    submitAddDynamicParams(){
      this.$refs.addDynamicParamsForm.validate(valid => {
        if (valid) {
          this.$axios.post(`categories/${this.thirdLevelId}/attributes`,{
            attr_name: this.addDynamicParamsObj.attr_name,
              attr_sel: 'many'
          }).then(res => {
            if (res.data.meta.status === 201) {
              //隐藏对话框
              this.dialogVisible4Add1 = false
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
    }
  }
}
</script>