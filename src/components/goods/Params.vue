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
      @active-item-change="changeCategory"
      :props="defaultProps"
      :change-on-select="true"
      @change="changeCategory"
      :show-all-levels="false"
      v-model="selectedOptions"
    ></el-cascader>
    <!-- 3.0 Tabs -->
    <el-tabs v-model="type" @tab-click="tabClick" type="border-card">
      <el-tab-pane label="动态参数" name="dynamic">动态参数</el-tab-pane>
      <el-tab-pane label="静态属性" name="static">静态属性</el-tab-pane>
    </el-tabs>
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
      type: 'dynamic'
      // selectedOptions:[1,3,6]
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
          //赋值
          this.options = response.data.data
          //默认选中
          const firstId = response.data.data[0].cat_id
          const secondId = response.data.data[0].children[0].cat_id
          const thirdId = response.data.data[0].children[0].children[0].cat_id

          this.selectedOptions = [firstId, secondId, thirdId]

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
    },
    //获取三级分类的动态参数
    getThreeLevelDynamicParams() {},
    //获取三级分类的静态参数
    getThreeLevelStaticProperty() {}
  }
}
</script>