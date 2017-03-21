<template>
  <div
    id="app"
    class="index"
    @click="add"
  >
    {{ msg }}
  </div>
</template>

<script>
  export default {
    data() {
      return {
        msg: 1
      }
    },
    methods: {
      add() {
        this.msg = this.msg + 1
      }
    }
  }
</script>

<style>
  .index {
    color: red;
  }
</style>