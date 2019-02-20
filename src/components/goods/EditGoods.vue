<template>
  <div>
    <div class="title">修改商品信息</div>
    <!-- 1.0步骤条 -->
    <el-steps :active="active" finish-status="success" :space="200">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- 2.0 Form表单 -->
    <el-form :model="goodsObj" :rules="rules" ref="goodsForm" label-width="150px">
      <!-- 3.0 左侧tabl栏目 -->
      <el-tabs @tab-click="tabClick" tab-position="left" value="base">
        <el-tab-pane label="基本信息" name="base">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="goodsObj.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="goodsObj.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="goodsObj.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              :options="options"
              placeholder="请选择分类"
              :show-all-levels="false"
              :props="props"
              @change="changeCategory"
              v-model="selectedOptions"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="goodsObj.is_promote" :label="1" border>是</el-radio>
            <el-radio v-model="goodsObj.is_promote" :label="0" border>否</el-radio>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="params">
          <!-- 动态参数 -->
          <el-form-item v-for="item in dparams" :key="item.attr_id" :label="item.attr_name">
            <!-- <el-checkbox
              @change="unSelectDynimacParams(index,item.attr_vals)"
              v-for="(subitem,index)  in item.attr_vals"
              :key="index"
              :label="subitem"
              border
            ></el-checkbox>-->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                v-for="(subitem,index) in item.attr_vals"
                :key="index"
                :label="subitem"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="property">
          <!-- 静态属性 -->
          <el-form-item v-for="item in sproperties" :key="item.attr_id" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="picture">
          <el-upload
            class="upload-demo"
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :headers="headers"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture"
            :file-list="fileList"
          >
            <el-button size="small" type="success" icon="el-icon-upload">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="content">
          <quill-editor v-model="goodsObj.goods_introduce"></quill-editor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 4.0 底部菜单按钮 -->
    <div class="footer">
      <el-button @click="$router.go(-1)">取消</el-button>
      <el-button type="primary" @click="updateGoods">修改</el-button>
    </div>
    <!-- 5.0 图片预览对话框 -->
    <el-dialog :visible.sync="dialogVisibleForPreview" width="50%">
      <img :src="previewImageUrl" alt>
    </el-dialog>
  </div>
</template>   


<style scoped>
.title {
  height: 45px;
  line-height: 45px;
  background-color: #d7e2ef;
  padding-left: 20px;
}
.el-steps {
  margin: 15px 0px;
  padding-left: 20px;
}
.footer {
  margin-top: 20px;
  text-align: center;
}
.el-tabs__item {
  margin-top: 15px;
}
.el-input {
  height: 20px;
  width: 600px;
}
.el-radio {
  margin-right: 10px;
  padding-right: 10px;
}
</style>

<script>
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: 0,
      options: [], // 级联选择器需要的数据
      goodsObj: {
        goods_name: '', //商品名称
        goods_cat: '', //商品分类
        goods_price: '', //商品价格
        goods_number: '', //商品数量
        goods_introduce: '好商品', //商品介绍
        is_promote: 0, //是否促销
        pics: [], //上传的图片临时路径（数组）
        attrs: [] //商品的参数（数组）
      },
      props: {
        //级联选择器与我们实际的数据的映射
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      cat_id: 0, //三级分类id
      dparams: [], //动态参数
      sproperties: [], //静态属性
      // 校验规则
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      headers: {
        //上传文件的请求头
        Authorization: localStorage.getItem('mytoken')
      },
      previewImageUrl: '', //要预览的图片路径
      dialogVisibleForPreview: false,
      selectedOptions: [], //默认选择的级联数据
      fileList: [] //修改时候,让用户看到之前添加的图片数组
    }
  },
  created() {
    this.getCategoriesData()
    this.getGoodsData()
  },
  methods: {
    //获取所有商品信息
    getGoodsData() {
      this.$axios.get(`goods/${this.$route.query.goods_id}`).then(res => {
        // console.log(res.data.data);
        this.selectedOptions = [
          res.data.data.cat_one_id,
          res.data.data.cat_two_id,
          res.data.data.cat_three_id
        ]
        //三级分类赋值
        this.cat_id = res.data.data.cat_id
        //给我们的fileList赋值,这样才能让用户看到
        res.data.data.pics.forEach((item, index) => {
          this.fileList.push({
            name: `第${index + 1}张`,
            url: item.pics_mid_url
          })
        })

        this.goodsObj = res.data.data
      })
    },
    tabClick(val) {
      switch (val.name) {
        case 'base':
          this.active = 0
          break
        case 'params':
          this.active = 1
          //加载第三级分类的动态参数
          this.getThreeLevelParamsOrPropertyData('many')
          break
        case 'property':
          this.active = 2
          //加载第三级分类的静态属性
          this.getThreeLevelParamsOrPropertyData('only')
          break
        case 'picture':
          this.active = 3
          break
        case 'content':
          this.active = 4
          break

        default:
          break
      }
    },
    //获取所有分类数据
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
        })
    },
    //分类改变
    changeCategory(val) {
      if (val.length < 3) {
        this.$message.error('请选择三级分类')
        return
      }
      // 拿到第三级分类，赋值给 goodsObj.goods_cat
      this.goodsObj.goods_cat = val.join(',')

      // 把第三级分类ID保存起来，方便后面查询商品参数和商品属性
      this.cat_id = val[val.length - 1]
    },
    //
    getThreeLevelParamsOrPropertyData(type) {
      if (!this.cat_id) {
        this.$message.error('请选择三级分类')
        return
      }
      //加载数据
      this.$axios
        .get(`categories/${this.cat_id}/attributes`, {
          params: {
            sel: type
          }
        })
        .then(res => {
          if (type === 'many') {
            // 给动态参数数组赋值
            res.data.data.forEach(item => {
              if (item.attr_vals.trim().length === 0) {
                item.attr_vals = []
              } else {
                item.attr_vals = item.attr_vals.split(',')
              }
            })
            this.dparams = res.data.data
          } else if (type === 'only') {
            this.sproperties = res.data.data
          }
        })
    },
    //图片上传相关
    handlePreview(file) {
      this.previewImageUrl = file.url
      this.dialogVisibleForPreview = true
    },
    //
    handleRemove(file, fileList) {
      //要删除的url地址

      const deleteUrl = file.url

      const dIndex = this.goodsObj.pics.findIndex(
        item => item.pic === deleteUrl
      )
      this.goodsObj.pics.splice(dIndex, 1)

      this.fileList.forEach((item, index) => {
        item.name = `第${index + 1}张`
      })
    },
    // 上传图片成功之后的回调函数
    handleSuccess(res, file, fileList) {
      // console.log(res)
      // console.log(file)
      // console.log(fileList)
      if (res.meta.status === 200) {
        this.goodsObj.pics.push({
          pic: res.data.tmp_path
        })
        //重新赋值
        this.fileList.push({
          url: res.data.url
        })
        this.fileList.forEach((item, index) => {
          item.name = `第${index + 1}张`
        })
      }
    },
    //修改商品
    updateGoods() {
      this.$refs.goodsForm.validate(valid => {
        if (valid) {
          //把动态参数与静态属性合在一起提交
          this.goodsObj.attrs = this.dparams.concat(this.sproperties)

          //发送请求
          this.$axios
            .put(`goods/${this.goodsObj.goods_id}`, this.goodsObj)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })

                // 跳转到商品列表
                this.$router.go(-1)
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
        }
      })
    }
  }
}
</script>