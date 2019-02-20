<template>
  <div>
    <my-search title="添加商品" @myquery="queryGoodsList" @myadd="addGoods"></my-search>

    <!-- 2.0 商品列表表格 -->
    <el-table :data="goodsList" border style="width: 100%">
      <el-table-column type="index" label="编号" width="80"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="300"></el-table-column>
      <el-table-column prop="goods_price" label="价格" width="90"></el-table-column>
      <el-table-column prop="goods_number" label="库存量" width="90"></el-table-column>
      <el-table-column label="商品状态" width="90">
        <template slot-scope="scope">{{scope.row.goods_state | filterState}}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">{{scope.row.add_time | dateFilter('-')}}</template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button class="el-icon-edit" size="small" type="primary" plain @click="$router.push({path:'/layout/goods/editgoods?goods_id='+scope.row.goods_id})"></el-button>
          <el-button class="el-icon-delete" size="small" type="danger" plain @click="deleteGoods(scope.row.goods_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 3.0分页条 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>


<script>
import MySearch from '../subcomponents/MySearch'
export default {
  //局部注册
  components: {
    'my-search': MySearch
  },
  data() {
    return {
      goodsList: [], //商品列表,给表格使用
      pagenum: 1,
      pagesize: 10,
      query: '', //查询参数
      total: 0 //总条数
    }
  },
  created() {
    this.getGoodsListData()
  },
  filters: {
    filterState(goods) {
      let state = ''
      switch (goods) {
        case 0:
          state = '未通过'
          break
        case 1:
          state = '审核中'
          break
        case 2:
          state = '已审核'
          break
      }
      return state
    }
  },
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
    },
    //到页面改变的时候触发
    handleSizeChange(pagesize) {
      this.pagesize = pagesize
      this.getGoodsListData()
    },
    //到页码改变时触发
    handleCurrentChange(pagenum) {
      this.pagenum = pagenum
      this.getGoodsListData()
    },
    //子组件触发了myquery事件之后,会调用该函数
    queryGoodsList(query) {
      //赋值给模型中的query
      this.query = query

      //搜索
      this.getGoodsListData()
    },
    addGoods() {
      // this.$router.push({name: 'Addgoods' })
      this.$router.push({ path: '/layout/goods/addgoods' })
    },
    deleteGoods(goods_id) {
      this.$confirm('删除该商品, 是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //删除的逻辑
          this.$axios.delete(`goods/${goods_id}`).then(response => {
            if (response.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: response.data.meta.msg
              })
              this.getGoodsListData()
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

<style scoped>
.el-pagination {
  background-color: #d3dce6;
  padding-top: 10px;
  height: 35px;
  line-height: 35px;
}
</style>