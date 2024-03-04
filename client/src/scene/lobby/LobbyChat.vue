<template>
  <div class="chat flex w-full h-80 backdrop-blur-lg backdrop-brightness-125">
    <!-- TODO 여기서부터 -->
  </div>
</template>

<script>
export default {
  name: "LobbyChat"
}
</script>


<style scoped>
.chat {
  background-color: rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0 35px 28px rgba(0, 0, 0, 0.7);
  box-shadow: 0 35px 28px rgba(0, 0, 0, 0.7);

  clip-path: polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 0, 100% 100%, 25px 100%, 0 calc(100% - 25px), 0 0);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

</style>