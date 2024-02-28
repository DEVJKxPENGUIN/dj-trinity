<template>
  <div class="lobby flex flex-col w-full h-full">
    <div class="top-bar h-24">

    </div>
    <div class="flex justify-center items-center text-white">
    </div>
    <div class="h-24" />
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {gsap} from "gsap";
import LobbyCanvas from "@/scene/lobby/LobbyCanvas";
import LobbySocket from "@/scene/lobby/LobbySocket";
import {get} from "@/manager/apiManager";

const STANDBY = 'standby'
export default {
  name: 'LobbyScene',
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
      channelUsers: [],
      channelChats: []

    }
  },
  methods: {
    ...mapActions(['showSystemPopup', 'showLoading', 'hideLoading']),
    async init() {
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
      }, 1000)
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
.top-bar {
  background: linear-gradient(to bottom, black, rgba(0, 0, 0, 0));

  /* fixme */
  border-bottom: 1px white;
}
</style>