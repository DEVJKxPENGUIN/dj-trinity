<template>
  <div class="profile flex flex-col text-xl w-full items-center justify-center backdrop-blur">
    <div class="avatar w-28 h-28 m-1">
      <img :src="user.profile"/>
    </div>
    <div class="nickname text-lg m-1 w-48">
      <span>{{ user.nickname }}</span>
      <div class="nickname-detail text-center">
        Lv&nbsp;{{ user.level ? user.level : 0 }}
      </div>
    </div>
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
  background-color: rgba(0, 0, 0, 0.4);
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

  span {
    transition: 3s linear;
    /*transform: translateX(calc(-100% + var(--container-width))); */
  }
}

.nickname-detail {
  font-size: 10px;
}
</style>