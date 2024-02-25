<template>
    <div class="popup flex flex-col">
      <div class="top flex h-20" />
      <div class="middle flex flex-row flex-1" >
        <div class="left flex-1" />
        <div class="center flex w-full sm:w-128 backdrop-blur">
          <slot/>
        </div>
        <div class="right flex-1" />
      </div>
      <div class="bottom flex h-20" />


    </div>

</template>

<script>
export default {
  name: 'Popup',
  components: {},
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
  background-color: rgba(0, 0, 0, .2);
}

.top {
  background-color: rgba(0, 0, 0, .7);
}

.bottom {
  background-color: rgba(0, 0, 0, .7);
}

.center {
  background-color: rgba(0, 0, 0, .5);
}
</style>