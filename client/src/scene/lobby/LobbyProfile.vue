<template>
  <div
      class="profile flex flex-col text-xl w-full items-center justify-center backdrop-blur-lg backdrop-brightness-125">
    <div class="top-bar flex flex-row w-full h-6 anta-regular text-sm backdrop-blur-3xl">
    </div>
    <div class="avatar w-28 h-28 m-1">
      <img :src="user?.['profile']" alt=""/>
    </div>
    <div class="nickname text-lg m-1 w-48">
      <span>{{ user['nickname'] }}</span>
      <div class="nickname-detail text-center">
        Lv&nbsp;{{ user['level'] ? user['level'] : 0 }}
      </div>
    </div>
    <div class="bottom-bar flex flex-row w-full h-6 anta-regular text-sm backdrop-blur-3xl">
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "LobbyProfile",
  props: {
    user: {
      type: Object
    }
  }
})
</script>

<style scoped>
.profile {
  background-color: rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0 35px 28px rgba(0, 0, 0, 0.7);
  box-shadow: 0 35px 28px rgba(0, 0, 0, 0.7);
  clip-path: polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 0, 100% 100%, 25px 100%, 0 calc(100% - 25px), 0 0);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.avatar {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 50%;
}

.avatar img {
  object-fit: cover;
}

.nickname {
  overflow: hidden;
}

.nickname span {
  transition: 3s linear;
  /*transform: translateX(calc(-100% + var(--container-width))); */
}

.nickname-detail {
  font-size: 10px;
}
</style>