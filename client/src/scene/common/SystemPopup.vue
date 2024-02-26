<template>
  <div class="flex flex-col w-full h-full fixed justify-center items-center">
    <div class="system-popup sm:w-128 h-fit ml-10 mr-10 drop-shadow-2xl shadow-black backdrop-blur">
      <!-- title -->
      <div class="text-white m-5 orbitron-regular text-lg">
        {{ systemPopupTitle }}
      </div>
      <div class="w-full h-0.5 ml-5 mr-5 line opacity-20"/>
      <div class="text-white opacity-50 m-5 orbitron-thin text-sm">
        {{ systemPopupContent }}
      </div>

      <div class="btn h-10 m-5 text-white text-center justify-center orbitron-regular text-lg">
        <div class="flicker">
          {{ systemPopupButton }}
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import {mapActions, mapState} from "vuex";
import {_systemPopupCallback} from "@/store/store";

export default {
  name: "SystemPopup",
  computed: {
    ...mapState(
        ['systemPopupTitle', 'systemPopupContent', 'systemPopupButton'])
  },
  created() {
    window.addEventListener('keydown', this.handleKeydown)
  },
  methods: {
    ...mapActions(['hideSystemPopup']),
    handleKeydown(e) {
      if (e.key === 'Enter') {
        this.hideSystemPopup()
        _systemPopupCallback()
      }
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  }
}
</script>

<style scoped>
.system-popup {
  background-color: rgba(0, 0, 0, .4);

  --s: 20px; /* the size on the corner */
  --t: 2px; /* the thickness of the border */
  --g: 0px; /* the gap between the border and image */

  padding: calc(var(--g) + var(--t));
  outline: var(--t) solid rgba(255, 255, 255, 0.5); /* the color here */
  outline-offset: calc(-1 * var(--t));
  mask: conic-gradient(at var(--s) var(--s), #0000 75%, #000 0) 0 0/calc(100% - var(--s)) calc(100% - var(--s)),
  linear-gradient(#000 0 0) content-box;
  transition: .1s;
}

.line {
  background-image: linear-gradient(to right, white, rgba(255, 255, 255, 0));
}

.btn {
  --s: 10px; /* the size on the corner */
  --t: 2px; /* the thickness of the border */
  --g: 0px; /* the gap between the border and image */

  padding: calc(var(--g) + var(--t));
  outline: var(--t) solid rgba(255, 255, 255, 0.5); /* the color here */
  outline-offset: calc(-1 * var(--t));
  mask: conic-gradient(at var(--s) var(--s), #0000 75%, #000 0) 0 0/calc(100% - var(--s)) calc(100% - var(--s)),
  linear-gradient(#000 0 0) content-box;
  transition: .1s;
}
</style>