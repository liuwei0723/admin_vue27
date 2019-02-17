<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!-- 1.0 导航面包屑 -->
        <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
      </el-col>
    </el-row>
    <!-- 2.0 添加角色 -->
    <el-button type="success" plain @click="addCategory">添加分类</el-button>
    <!-- 3.0 树状表格 -->
    <dzh-tree-grid :columns="columns" :loading="loading" :dataSource="categories">
      <template slot-scope="scope">
        <el-button plain title="修改商品分类" type="primary" size="small" icon="el-icon-edit" @click="editCategory(scope.row)"></el-button>
        <el-button plain title="删除商品分类" type="danger" size="small" icon="el-icon-delete" @click="deleteCategory(scope.row.cat_id)"></el-button>
      </template>
    </dzh-tree-grid>
    <!-- 4.0 分页条 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 5.0 新增分类的对话框 -->
    <el-dialog title="新增分类" :visible.sync="dialogVisible4Add" width="50%">
      <el-form
        :model="addCategoryObj"
        :rules="rules"
        ref="addCategoryForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryObj.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            placeholder="不选择就创建第一级"
            :options="options"
            @active-item-change="changeCategory"
            :props="defaultProps"
            :change-on-select="true"
            @change="changeCategory"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Add = false">取 消</el-button>
        <el-button type="primary" @click="submitAddCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 6.0 修改分类的对话框 -->
    <el-dialog title="修改分类" :visible.sync="dialogVisible4Edit" width="50%">
      <el-form :model="editCategoryObj" :rules="rules" ref="editCategoryForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCategoryObj.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4Edit = false">取 消</el-button>
        <el-button type="primary" @click="submitCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//导入
import MyBreadcrumb from '../subcomponents/MyBreadcrumb'
import DZHTreeGrid from 'dzh-tree-grid'

export default {
  components: {
    // "my-breadcrumb":MyBreadcrumb
    MyBreadcrumb,
    'dzh-tree-grid': DZHTreeGrid
  },
  data() {
    return {
      categories: [], //分类数据
      pagenum: 1, //默认加载第一页
      pagesize: 10, //页容量
      total: 0, //总条数
      columns: [
        // 需要展示的列
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '级别',
          prop: 'cat_level_name',
          width: 500 // 可选
        }
      ],
      loading: true, // 正在加载中...
      dialogVisible4Add: false,
      dialogVisible4Edit:false,
      addCategoryObj: {
        //将来要提交给后台的
        cat_pid: 0, //父级分类
        cat_name: '', //分类的名字
        cat_level: 0 //一级为0
      },
      editCategoryObj: {
        cat_id: 0, //父级分类
        cat_name: '', //分类的名字
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      options: [], //cascader菜单展示需要的数据
      defaultProps: {
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      }
    }
  },
  created() {
    this.getCategoriesData()
  },
  methods: {
    getCategoriesData() {
      // 要去加载数据了...
      this.loading = true
      this.$axios
        .get('categories', {
          params: {
            type: 3,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        .then(response => {
          console.log(response)
          this.loading = false
          //赋值
          this.categories = response.data.data.result
          this.total = response.data.data.total
        })
    },
    //分页条的页容量发生了改变
    handleSizeChange(size) {
      this.pagesize = size

      this.getCategoriesData()
    },
    //分页条的页码发生了改变
    handleCurrentChange(page) {
      this.pagenum = page
      this.getCategoriesData()
    },
    //加载级联菜单
    addCategory() {
      this.$axios
        .get('categories', {
          params: {
            type: 2
          }
        })
        .then(response => {
          //赋值
          this.options = response.data.data

          this.dialogVisible4Add = true
        })
    },
    //分类改变
    changeCategory(val) {
      if (val.length == 1) {
        //添加二级分类
        this.addCategoryObj.cat_pid = val[0]
        this.addCategoryObj.cat_level = 1
      } else if (val.length == 2) {
        //添加三级分类
        this.addCategoryObj.cat_pid = val[1]
        this.addCategoryObj.cat_level = 2
      } else {
        //添加一级分类
        this.addCategoryObj.cat_pid = 0
        this.addCategoryObj.cat_level = 0
      }
    },
    submitAddCategory() {
      this.$refs.addCategoryForm.validate(valid => {
        if (valid) {
          this.$axios.post(`categories`, this.addCategoryObj).then(res => {
            if (res.data.meta.status === 201) {
              this.addCategoryObj.cat_name = ''
              //隐藏对话框
              this.dialogVisible4Add = false
              //提示
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              // 重新查询
              this.getCategoriesData()
            }
          })
        }
      })
    },
    //弹出修改分类的对话框
    editCategory(obj) {
      console.log(obj);
      
      this.editCategoryObj.cat_id = obj.cat_id
      this.editCategoryObj.cat_name = obj.cat_name

      this.dialogVisible4Edit = true
    },
    submitCategory() {
      this.$refs.editCategoryForm.validate(valid => {
        if (valid) {
          this.$axios.put(`categories/${this.editCategoryObj.cat_id}`,{
            cat_name:this.editCategoryObj.cat_name
          }).then(res => {
            if (res.data.meta.status === 200) {
              
              //提示
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              //隐藏对话框
              this.dialogVisible4Edit = false
              // 重新查询
              this.getCategoriesData()
            }
          })
        }
      })
    },
    deleteCategory(cat_id){
      this.$confirm('删除该分类, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //删除的逻辑
          this.$axios.delete(`categories/${cat_id}`).then(response => {
            // console.log(response)
            if (response.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: response.data.meta.msg
              })
              this.getCategoriesData()
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