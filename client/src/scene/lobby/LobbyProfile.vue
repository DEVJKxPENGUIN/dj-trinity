<template>
  <div class="profile flex flex-col text-xl w-full items-center justify-center">
    <div class="avatar w-32 h-32 m-3">
        <img :src="user.profile" />
    </div>
    <div class="nickname m-3 w-48">
      <span>{{user.nickname}}</span>
    </div>
<!--    <div>-->
<!--      <img :src="user.profile" />-->
<!--    </div>-->
<!--    <div>-->
<!--      {{ user.nickname }}-->
<!--    </div>-->
  </div>
</template>

<script>
export default {
  name: "LobbyProfile",
  props: {
    user: {
      type: Object
    }
  }
}
</script>

<style scoped>
.profile {
  background-color: rgba(0, 0, 0, 0.5);
}
.avatar {
  aspect-ratio : 1 / 1;
  overflow: hidden;
  border-radius: 50%;
}
.avatar img {
  object-fit: cover;
}
.nickname {
  overflow: hidden;
  span {
    transition: 3s linear;
    /*transform: translateX(calc(-100% + var(--container-width))); */
  }
}
</style>