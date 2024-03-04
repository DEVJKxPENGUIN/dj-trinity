<template>
  <div class="chat flex w-full h-80 backdrop-blur-lg backdrop-brightness-125">
    <!-- TODO 여기서부터 -->
    <div class="top-bar flex flex-row h-6 anta-regular text-sm">
      CHATTING
    </div>
    <div class="list flex flex-1 flex-col">
      <div v-for="(chat, index) in chats" class="item flex flex-row w-full h-8 items-center" v-bind:key="index" >
        <div class="nickname w-fit">
          {{chat.nickname}}
        </div>
        <div class="message flex flex-1">
          {{chat.message}}
        </div>
        <div class="time w-fit">
          {{chat.sendTime}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LobbyChat",
  props: {
    chats: {
      type: Array,
      default: () => []
    }
  },
}
</script>


<style scoped>
.chat {
  background-color: rgba(0, 0, 0, 0.3);
  overflow-y: hidden;
  -webkit-box-shadow: 0 35px 28px rgba(0, 0, 0, 0.7);
  box-shadow: 0 35px 28px rgba(0, 0, 0, 0.7);
  clip-path: polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 0, 100% 100%, 25px 100%, 0 calc(100% - 25px), 0 0);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.list {
  overflow-y: scroll;
  overflow-x: hidden;
}

.item {
  opacity: 60%;
}
</style>