<template>
    <div style="background-color:red;">
        这是组件1
        <button @click="sendValue">传值给组件2</button>
    </div>
</template>

<script>
import bus from './bus'
export default {
    methods:{
        sendValue(){
            // console.log(bus)
            // console.log("我要传值")
            // 使用公共的bus传值
            bus.$emit('event1',{name:'小明',age:25})
        }
    }
}
</script>
