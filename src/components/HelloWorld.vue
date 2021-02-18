<template>
  <div>
    
    <p>{{ defaultText }}</p>
    <el-button>测试123</el-button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  mounted () {
    // browser.runtime.sendMessage({})
  },
  computed: {
    defaultText () {
      return "1"
    }
  }
}
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
