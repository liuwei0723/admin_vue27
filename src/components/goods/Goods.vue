<template>
  <div>
    <!-- 1.0 导航面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
    <!-- 2.0 嵌套路由的占位符 -->
        <router-view></router-view>
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
    return {}
  },
  created() {},
  methods: {}
}
</script>