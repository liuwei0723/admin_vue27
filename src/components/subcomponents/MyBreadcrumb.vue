<!-- 面包屑 -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <button @click="sendValueToParent">传值给父组件</button> -->
  </div>
</template>

<script>
export default {
  //可以是任务类型
  // props:['level1','level2']
  props: {
    level1: String,
    level2: String
  },
  methods: {
    sendValueToParent(){ //{name:'小明',age:20}
      /**
       * 参数1：自定义事件名称
       * 参数2：需要传递的参数，可以是任意类型，比如字符串、数字、数组...
       */
      // this.$emit('myevent',{name:'小明',age:20})
      this.$emit('myevent',[{name:'小明',age:20},{name:'小红',age:22}])
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  background-color: #d3dce6;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
}
</style>