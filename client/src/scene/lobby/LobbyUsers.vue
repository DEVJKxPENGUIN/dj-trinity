<template>
  <div
      class="users flex flex-1 flex-col text-xl w-full h-full backdrop-blur">
    <div class="top-bar h-6 anta-regular text-sm">
      ONLINE
    </div>
    <div class="list">
      <div class="item flex w-full h-12 items-center overflow-hidden" v-for="(user) in users" v-bind:key="user.id">
        <div class="avatar w-10 h-10 m-2">
          <img :src="user.profile"/>
        </div>
        <div class="flex flex-col">
          <p class="text-xs h-fit">{{ user.nickname }}</p>
          <p class="nickname-detail h-fit">Lv&nbsp;{{user.level ? user.level : 0}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LobbyUsers",
  props: {
    users: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.users {
  background-color: rgba(0, 0, 0, 0.4);
  overflow: scroll;
}
.list {
  opacity: 60%;
}
.avatar {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 50%;
}
.item {
}

.nickname-detail {
  font-size: 9px;
}
</style>