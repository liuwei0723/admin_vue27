<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!-- 面包屑 -->
        
        <my-breadcrumb level1='权限管理' level2='权限列表'></my-breadcrumb>
      </el-col>
    </el-row>
    <el-table :data="rightsList" border style="width: 100%">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级" :formatter="formatter"></el-table-column>
    </el-table>
  </div>
</template>



<script>
//导入
import MyBreadcrumb from '../subcomponents/MyBreadcrumb'

export default {
  components:{
    // "my-breadcrumb":MyBreadcrumb
    MyBreadcrumb
  },
  data() {
    return {
      rightsList: [] //权限列表,给表格使用
    }
  },
  //当我们Rights组件的实例,创建完毕的时候,就会执行
  /**
   * created 是Vue实例创建出来之后,就会执行
   * mounted 是页面完成了初次渲染之后,才会执行,执行的时机会晚于created
   * 如果你希望我们的数据请求,越早发越好,这个时候就建议使用created
   */
  created() {
    this.getRightListData()
  },
  methods: {
    getRightListData() {
      this.$axios.get(`rights/list`).then(response => {
        console.log(response)
        //赋值给模型
        this.rightsList = response.data.data
      })
    },
    //格式化我们的层级
    formatter(row, column) {
      if (row.level == 0) {
        return '一级'
      } else if (row.level == 1) {
        return '二级'
      } else if (row.level == 2) {
        return '三级'
      }
    }
  }
}
</script>