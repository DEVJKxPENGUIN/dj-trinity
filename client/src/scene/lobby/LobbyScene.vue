<template>
  <div class="flex w-full h-full orbitron-thin text-white">
    <div class="lobby-col flex flex-col w-full h-full">
      <div class="flex flex-row-reverse top-bar h-20">
        <div class="flex w-full">
        </div>
      </div>
      <div class="flex flex-1 justify-center items-center">
      </div>
      <div class="flex h-24" />
    </div>

    <div class="lobby-row flex flex-row w-full h-full p-3">
      <div class="flex flex-col text-xs sm:w-80">
        {{channelId}}
        <LobbyProfile :user="user" class="mt-3" />

      </div>
    </div>
  </div>

</template>

<script>
import {mapActions, mapState} from "vuex";
import {gsap} from "gsap";
import LobbyCanvas from "@/scene/lobby/LobbyCanvas";
import LobbySocket from "@/scene/lobby/LobbySocket";
import {get} from "@/manager/apiManager";
import * as authenticationManager from "@/manager/authenticationManager";
import LobbyProfile from "@/scene/lobby/LobbyProfile.vue";

const STANDBY = 'standby'
export default {
  name: 'LobbyScene',
  components: {LobbyProfile},
  computed: {
    ...mapState(['isLoading', 'isSystemPopup'])
  },
  props: {
    manager: null
  },
  created() {
    this.init()
  },
  data() {
    return {
      // js

      // view
      channelId: '',
      user: {},
      channelUsers: [],
      channelChats: []

    }
  },
  methods: {
    ...mapActions(['showSystemPopup', 'showLoading', 'hideLoading']),
    async init() {
      this.user = await authenticationManager.userInfo()
      await this.manager.initScene(
          new LobbyCanvas(this),
          new LobbySocket(this)
      )
      window.addEventListener('keydown', this.keyboard)
      setTimeout(() => {
        gsap.to('#overlay', {
          duration: 0.5,
          opacity: 0,
          ease: "power2.in",
        })
      }, 0)
    },
    keyboard(e) {
      if (this.isLoading || this.isSystemPopup) {
        return
      }

      if (e.key === 'ArrowUp') {
        this.handleArrowUp()
      } else if (e.key === 'ArrowDown') {
        this.handleArrowDown()
      } else if (e.key === 'Enter') {
        this.handleEnter()
      } else if (e.key === 'Escape') {
        this.handleEsc()
      }
    },
    handleEnter() {
    },
    handleArrowUp() {

    },
    handleArrowDown() {

    },
    handleEsc() {

    },
    async enterChannel(channelInfo) {
      this.channelId = channelInfo['channelId']
      await this.updateChannel(channelInfo)
    },
    async updateChannel(channelInfo) {
      this.channelUsers = await get('/users', {userIds: channelInfo['users'].join(',')})
    },
    async updateChatBox(receivedChat) {
      this.channelChats.push(receivedChat)
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keyboard)
  }
}

</script>

<style scoped>
.lobby-col {
  position: fixed;
}

.lobby-row {
  position: fixed;
}

.top-bar {
  background: linear-gradient(to bottom, black, rgba(0, 0, 0, 0));
  /*background-color: greenyellow; */
}

</style>