//导入vue
import Vue from 'vue'


Vue.filter('dateFilter',(input,operator = '-')=>{    
    // operator =operator || '-'
    const date = new Date(input)
    const year = date.getFullYear()
    const month = date.getMonth()+1
    const day = date.getDate()
    const hour = date.getHours()
    const minus = date.getMinutes()
    const second = date.getSeconds()

    return `${year}${operator}${month}${operator}${day} ${hour}:${minus}:${second}`
    

})