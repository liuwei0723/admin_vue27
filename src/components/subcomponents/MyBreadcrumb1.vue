<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(title,index) in breadcrumbTitles" :key="index">{{title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data(){
    return {
      breadcrumbTitles:[],  //面包屑数据数组
    }
  },
  // props中接收的值，可以是任何类型
  // props:['breadcrumbTitles'],
  // props:{ // 这种写法更加精细化
  //   level1:String,
  //   level2:String,
  // },
  methods:{
    sendValueToParent(){ //{name:'小明',age:20}
      /**
       * 参数1：自定义事件名称
       * 参数2：需要传递的参数，可以是任意类型，比如字符串、数字、数组...
       */
      // this.$emit('myevent',{name:'小明',age:20})
      this.$emit('myevent')
    }
  },
//我的思路是:  用户一旦登录成功后,  整个菜单数据其实是固定的, 当用户点击某个3级菜单时, 会有this.$route.path来记录用户的页面,    
//后续就需要从菜单数据中挑出与this.$route.path映射的数组数据,然后遍历输出至面包屑子项
  created(){
    let strPath = this.$route.path;
    strPath = strPath.substr(strPath.lastIndexOf('/')+1)

    this.$axios.get('menus').then(res=>{
      let arrPath = res.data.data;
      arrPath.forEach(element => {
        element.children.forEach(el=>{
          if(el.path == strPath){
            this.breadcrumbTitles.push(element.authName)
            this.breadcrumbTitles.push(el.authName)
          }
        })
      });
    })
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

