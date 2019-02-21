<template>
    <div>
        <ul>
            <li v-for="todo in todos" :key="todo.id">
                <!-- {{todo.text}} -->
                <!-- 作用域插槽，把每一个todo传递回父组件 -->
                <slot :abc="todo" ccc="我是从子组件过来的"></slot>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props:{
        todos:Array
    }
}
</script>
