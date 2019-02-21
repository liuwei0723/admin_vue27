<template>
  <div>
    <!-- 1.0 面包屑导航 -->
    <MyBreadcrumb level1="订单管理" level2="订单列表"/>
    <!-- 2.0 搜索框和按钮 -->
    <div>
      <el-input
        placeholder="请输入搜索内容"
        v-model="query"
        @keyup.enter.native="getOrderListData"
        class="search"
      >
        <el-button @click="getOrderListData" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <!-- 3.0 表格 -->
    <el-table :data="orderList" style="width: 100%">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="210"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
      <el-table-column :formatter="statusFormatter" prop="pay_status" label="订单状态" width="100"></el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
      <el-table-column prop="order_fapiao_title" label="发表抬头" width="100"></el-table-column>
      <el-table-column label="下单时间" width="180">
        <template slot-scope="scope">
          <div>{{scope.row.create_time | dateFilter('/')}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            class="el-icon-setting"
            size="small"
            type="primary"
            @click="dialogVisible4City = true"
            plain
          ></el-button>
          <el-button
            class="el-icon-location"
            size="small"
            type="warning"
            @click="dialogVisible4Map = true"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4.0 分页条 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 5.0 省市区选择 -->
    <el-dialog title="省市区选择" :visible.sync="dialogVisible4City" width="50%">
      <v-distpicker
        @selected="onSelected"
        :province="select.province.value"
        :city="select.city.value"
        :area="select.area.value"
      ></v-distpicker>
      <el-input
        type="textarea"
        style="margin-top:5px;"
        :rows="3"
        placeholder="请输入内容"
        v-model="textarea"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4City = false">取 消</el-button>
        <el-button type="primary" @click="showDetailAddress">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 6.0 百度地图 -->
    <el-dialog title="百度地图" :visible.sync="dialogVisible4Map" width="50%">
      
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4City = false">取 消</el-button>
        <el-button type="primary" @click="showDetailAddress">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MyBreadcrumb from '../subcomponents/MyBreadcrumb'
import VDistpicker from 'v-distpicker'
export default {
  // 局部注册
  components: {
    MyBreadcrumb,
    VDistpicker
  },
  data() {
    return {
      query: '', //查询关键字
      pagenum: 1, //当前页码
      pagesize: 10, //页容量
      total: 0, //总条数
      orderList: [], //订单列表
      dialogVisible4City: false, //省市区弹框
      dialogVisible4Map:false,
      select: {
        province: {
          code: '440000',
          value: '广东省'
        },
        city: {
          code: '440300',
          value: '深圳市'
        },
        area: {
          code: '440306',
          value: '宝安区'
        }
      },
      textarea: ''
    }
  },
  created() {
    this.getOrderListData()
  },
  methods: {
    getOrderListData() {
      this.$axios
        .get('orders', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        .then(res => {
          this.orderList = res.data.data.goods

          this.total = res.data.data.total
        })
    },
    // 格式化支付状态
    statusFormatter(row, column) {
      let statusName = ''
      switch (row.pay_status) {
        case '0':
          statusName = '未支付'
          break

        case '1':
          statusName = '已支付'
          break

        default:
          break
      }

      return statusName
    },
    // 更改当前页容量
    handleSizeChange(size) {
      this.pagesize = size

      this.getOrderListData()
    },
    // 更改当前页面
    handleCurrentChange(page) {
      this.pagenum = page

      this.getOrderListData()
    },
    onSelected(data) {
      this.select = data
    },
    // 拿到了具体的地址
    showDetailAddress() {
      const message = `${this.select.province.value} ${
        this.select.city.value
      } ${this.select.area.value} ${this.textarea}`
      this.$message({
        type: 'success',
        message
      })

      this.dialogVisible4City = false
    },
    // 展示百度地图
    showMap() {}
  }
}
</script>

<style scoped>
.search {
  width: 300px;
}
.el-pagination {
  background-color: #d3dce6;
  padding-top: 10px;
  height: 35px;
  line-height: 35px;
}
</style>

