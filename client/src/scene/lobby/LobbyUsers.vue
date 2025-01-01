<template>
  <div
      class="users flex flex-1 flex-col text-xl w-full backdrop-blur-lg backdrop-brightness-125">
    <div class="top-bar flex flex-row w-full h-6 anta-regular text-sm backdrop-blur-3xl">
      ONLINE
    </div>
    <div class="list flex flex-1 flex-col">
      <div v-for="(user) in users" class="item flex w-full h-12 items-center" v-bind:key="user.id">
        <div class="avatar w-10 h-10 m-2">
          <img :src="user.profile" alt=""/>
        </div>
        <div class="flex flex-col">
          <p class="text-xs h-fit">{{ user.nickname }}</p>
          <p class="nickname-detail h-fit">Lv&nbsp;{{ user.level ? user.level : 0 }}</p>
        </div>
      </div>
    </div>
    <div class="bottom-bar flex flex-row w-full h-6 anta-regular text-sm backdrop-blur-3xl">
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "LobbyUsers",
  props: {
    users: {
      type: Array,
      default: () => []
    }
  }
})
</script>

<style scoped>
.users {
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

.avatar {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 50%;
}

.item {
  opacity: 60%;
}

.nickname-detail {
  font-size: 9px;
}
</style>