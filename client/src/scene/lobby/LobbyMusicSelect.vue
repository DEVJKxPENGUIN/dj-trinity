<template>
  <div class="music-select flex flex-col h-full justify-center items-center">
    <div class="top-bar flex h-10p"></div>
    <div class="record flex h-60p">
      <img class="opacity-50 " :src="'http://localhost:5002/download/bms/stage/' + bmsCurrent.id"/>
    </div>
    <div class="bottom-bar flex h-30p"></div>
  </div>
</template>

<script>
export default {
  name: "LobbyMusicSelect",
  props: {
    bmsCurrent: {
      type: Object,
      default: () => {
      }
    }
  },
  watch: {
    bmsCurrent() {
      console.log(this.bmsCurrent)
    }
  },
  created() {

  }
}
</script>


<style scoped>
.music-select {

}

.record {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 50%;
  border: 12px solid transparent;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
  linear-gradient(to right, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.5) 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
}

.record img {
  object-fit: cover;
}

.h-10p {
  height: 15%;
}

.h-60p {
  height: 60%;
}

.h-30p {
  height: 25%;
}
</style>