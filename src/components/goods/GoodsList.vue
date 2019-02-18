<template>
  <div>

    
  </div>
</template>


<script>
export default {
  data() {
    return {
      goodsList: [], //商品列表,给表格使用
      pagenum: 1,
      pagesize: 10,
      query: '' //查询参数
    }
  },
  created() {},
  methods: {
    //商品列表
    getGoodsListData() {
      this.$axios
        .get('goods', {
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
            query: this.query
          }
        })
        .then(response => {
          //赋值
          this.goodsList = response.data.data.goods
          this.total = response.data.data.total
        })
    }
  }
}
</script>