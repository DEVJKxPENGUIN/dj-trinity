<template>
  <div v-if="show" class="popup flex flex-col">
    <div class="top flex h-20"/>
    <div class="middle flex flex-col sm:flex-row flex-1">
      <div class="left sm:flex-1"/>
      <div
          :class="'center flex h-1/2 sm:h-full w-full sm:w-128 justify-center items-center backdrop-brightness-125 ' + blur"
      >
        <slot name="text"/>
      </div>
      <div class="line h-0 sm:h-full sm:w-0.5 sm:mt-5 sm:mb-5"></div>
      <div
          :class="'center flex h-1/2 sm:h-full w-full sm:w-128 justify-center items-center backdrop-brightness-125 ' + blur"
      >
        <slot name="form"/>
      </div>
      <div class="right sm:flex-1"/>
    </div>
    <div class="bottom flex h-20"/>
  </div>

</template>

<script>
export default {
  name: 'Popup',
  components: {},
  props: {
    show: {
      type: Boolean,
      default: true
    },
    blur: {
      type: String,
      default: 'backdrop-blur-lg'
    }
  },
  created() {
    this.init()
  },
  data() {
    return {
      // js

      // view
    }
  },
  methods: {
    async init() {

    },
  },

  beforeUnmount() {
  }
}
</script>


<style scoped>
.popup {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .1);
  z-index: 1;
}

.top {
  background-color: rgba(0, 0, 0, .8);
}

.bottom {
  background-color: rgba(0, 0, 0, .8);
}

.center {
  background-color: rgba(0, 0, 0, .3);
  -webkit-box-shadow: 0 35px 28px rgba(0, 0, 0, 0.7);
  box-shadow: 0 35px 28px rgba(0, 0, 0, 0.7);
}

.line {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%);
}
</style>