<template>
  <div class="lobby flex flex-col w-full h-full">
    <!-- TODO!!! -->
    <div class="justify-center items-center text-white">
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: 'LobbyScene',
  computed: {
    ...mapState(['isLoading', 'isSystemPopup'])
  },
  created() {
    this.init()
  },
  data() {
    return {
      // js

      //view

    }
  },
  methods: {
    ...mapActions(['showSystemPopup', 'showLoading', 'hideLoading']),
    async init() {
      window.addEventListener('keydown', this.keyboard)
    },
    keyboard(e) {
      if (this.isLoading || this.isSystemPopup) {
        return
      }

      if (e.key === 'ArrowUp') {
        this.handleArrowUp()
      } else if (e.key === 'ArrowDown') {
        this.handleArrowDown()
      } else if (e.key === 'Enter') {
        this.handleEnter()
      } else if (e.key === 'Escape') {
        this.handleEsc()
      }
    },
    handleEnter() {
    },
    handleArrowUp() {

    },
    handleArrowDown() {

    },
    handleEsc() {

    },
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keyboard)
  }
}

</script>

<style scoped>

</style>