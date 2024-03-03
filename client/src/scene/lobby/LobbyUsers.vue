<template>
  <div
      class="users flex flex-1 flex-col text-xl w-full h-full backdrop-blur">
    <div class="top-bar h-6 anta-regular text-sm">
      ONLINE
    </div>
    <div class="list h-full">
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
}
.list {
  opacity: 60%;
  overflow-y: scroll;
  overflow-x: hidden;
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

/*
.list::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 3px rgba(255, 247, 0, 0.3);
  background-color: #0015ff;
}

.list::-webkit-scrollbar
{
  width: 2px;
  background-color: #ff0000;
}

.list::-webkit-scrollbar-thumb
{
  background-color: #000000;
  outline: 2px solid #ffffff;
}
 */
</style>