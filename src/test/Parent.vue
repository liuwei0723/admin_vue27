<template>
    <div>我是父组件

        <br />

        <!-- <child> -->
            <!-- <h3>111</h3> -->
            <!-- <template slot="footer"> -->
               <!-- <button>轮播中轮播button</button> -->
            <!-- </template> -->
            <!-- <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550651819&di=0519fbc2ab5fd0b58f3f51d9055bd572&imgtype=jpg&er=1&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201402%2F14%2F20140214120558_2f4NN.jpeg" alt=""> -->
        <!-- </child> -->

        <!-- 非父子组件传值（兄弟组件） -->
        <!-- 
        <component1></component1>
        <hr>
        <Other2></Other2>
        -->

        <!-- 作用域插槽 -->
        <Todo :todos="todos">
            <template slot-scope="bbb">
                <!-- <span>xxxxxxx</span>{{bbb}} -->
                <span v-if="bbb.abc.id==1">✔ {{bbb.abc.text}}</span>
                <span v-else>x {{bbb.abc.text}}</span>
            </template>
        </Todo>
    </div>
</template>

<script>
// 导入子组件
import Child from './Child'
import Other1 from './Other1'
import Other2 from './Other2'
import Todo from './Todo'
export default {
    // 局部注册
    components:{
        Child,
        "component1":Other1,
        Other2,
        Todo
    },
    data(){
        return {
            todos:[
                {id:1,text:'吃饭'},
                {id:2,text:'睡觉'},
                {id:3,text:'做梦'}
            ]
        }
    }
}
</script>
