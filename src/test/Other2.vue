<template>
    <div style="background-color:green;">
        这是组件2
    </div>
</template>

<script>
import bus from './bus'
export default {
    created(){
        //监听事件
        /**
         * 参数1：自定义事件名称
         * 参数2：回调函数
         */
        bus.$on('event1',data=>{
            console.log("----组件2----")
            console.log(data)
        })
    }
}
</script>
