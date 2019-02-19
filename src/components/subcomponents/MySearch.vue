<template>
  <div>
    <el-input
      class="search"
      placeholder="请输入要搜索的内容"
      v-model="query"
      @keyup.13.native = "search"
    >
      <el-button
        slot="append"
        @click="search"
        icon="el-icon-search"
      ></el-button>
    </el-input>
    <el-button
      style="margin-left:5px;"
      type="success"
      plain
      @click="addGoods"
    >{{title}}</el-button>
  </div>
</template>

<script>
export default {
  props: ['title'],
  data() {
    return {
      query: ''
    }
  },
  methods: {
    addGoods(){
        this.$emit('myadd')
      
    },
    search(){
        // 把我们的关键字输入的内容，传递给父组件
        this.$emit('myquery',this.query)
    }
  }
}
</script>

<style scoped>
.search {
  width: 300px;
}
</style>
