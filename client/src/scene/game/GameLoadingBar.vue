<template>
  <div class="flex flex-row">
    <div :class="['w-2', 'square', percent > 0 ? 'bg-gray-50':'bg-gray-500']"></div>
    <div :class="['w-2', 'square', percent > 10 ? 'bg-gray-50':'bg-gray-500']"></div>
    <div :class="['w-2', 'square', percent > 20 ? 'bg-gray-50':'bg-gray-500']"></div>
    <div :class="['w-2', 'square', percent > 30 ? 'bg-gray-50':'bg-gray-500']"></div>
    <div :class="['w-2', 'square', percent > 40 ? 'bg-gray-50':'bg-gray-500']"></div>
    <div :class="['w-2', 'square', percent > 50 ? 'bg-gray-50':'bg-gray-500']"></div>
    <div :class="['w-2', 'square', percent > 60 ? 'bg-gray-50':'bg-gray-500']"></div>
    <div :class="['w-2', 'square', percent > 70 ? 'bg-gray-50':'bg-gray-500']"></div>
    <div :class="['w-2', 'square', percent > 80 ? 'bg-gray-50':'bg-gray-500']"></div>
    <div :class="['w-2', 'square', percent > 90 ? 'bg-gray-50':'bg-gray-500']"></div>
  </div>
</template>

<script>
export default {
  name: "GameLoadingBar",
  props: {
    total: {
      type: Number,
      default: 0
    },
    current: {
      type: Number,
      default: 0
    }
  },
  watch: {
    current() {
      if (this.total === 0) {
        return 0
      }

      const p = (this.current / this.total) * 100
      this.percent = Math.floor(p / 10) * 10
      console.log(this.percent)
    }
  },
  data() {
    return {
      percent: 0
    }
  }
}
</script>

<style scoped>
.square {
  height: 100%;
  margin-right: 4px;
}
</style>