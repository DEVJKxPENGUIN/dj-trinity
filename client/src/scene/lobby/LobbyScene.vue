<template>
  <div class="flex w-full h-full orbitron-thin text-white">
    <div class="lobby-col flex flex-col w-full h-full">
      <div class="flex flex-row-reverse top-bar h-20">
        <div class="flex w-full">
        </div>
      </div>
      <div class="flex flex-1 justify-center items-center">
      </div>
      <div class="flex h-24"/>
    </div>

    <div class="lobby-row flex flex-row w-full h-full p-2">
      <div class="flex flex-col sm:w-72 overflow-hidden">
        <span class="anta-regular text-sm">{{ channelId.toUpperCase() }}</span>
        <LobbyProfile :user="user" class="mt-1"/>
        <LobbyUsers :users="channelUsers" class="mt-1"/>
      </div>
      <div class="flex flex-1 flex-col ">
        <div class="flex flex-1"></div>
        <LobbyChat ref="chat" :chats="channelChats" class="mt-1 ml-2 mr-2" @inputMessage="handleChatInput"  @inputFocus="handleChatInputFocus" />
      </div>
      <div class="flex flex-1">

      </div>
    </div>
  </div>

</template>

<script>
import {mapActions, mapState} from "vuex";
import LobbyCanvas from "@/scene/lobby/LobbyCanvas";
import LobbySocket from "@/scene/lobby/LobbySocket";
import {get} from "@/manager/apiManager";
import * as authenticationManager from "@/manager/authenticationManager";
import LobbyProfile from "@/scene/lobby/LobbyProfile.vue";
import LobbyUsers from "@/scene/lobby/LobbyUsers.vue";
import LobbyChat from "@/scene/lobby/LobbyChat.vue";

const STANDBY = 'standby'
const CHATINPUT = 'chatinput'
export default {
  name: 'LobbyScene',
  components: {LobbyChat, LobbyUsers, LobbyProfile},
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
      state: STANDBY,
      beforeState: STANDBY,

      // view
      channelId: '',
      user: {},
      channelUsers: [],
      channelChats: [],
      chatMessage: '',
    }
  },
  methods: {
    ...mapActions(['showSystemPopup', 'showLoading', 'hideLoading', 'hideSceneChange']),
    async init() {
      this.user = await authenticationManager.userInfo()
      await this.manager.initScene(
          new LobbyCanvas(this),
          new LobbySocket(this)
      )
      window.addEventListener('keydown', this.keyboard)
      setTimeout(async () => {
        await this.hideSceneChange()
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
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault()
        this.handleShiftEnter()
      } else if (e.key === 'Enter') {
        this.handleEnter()
      } else if (e.key === 'Escape') {
        this.handleEsc()
      }
    },
    handleEnter() {
      if(this.state === CHATINPUT) {
        this.sendChat()
        return
      }
    },
    handleShiftEnter() {
      if(this.state !== CHATINPUT) {
        this.state = CHATINPUT
        this.openChat()
        return
      }
    },
    handleArrowUp() {

    },
    handleArrowDown() {

    },
    handleEsc() {

    },
    handleChatInput(message) {
      this.chatMessage = message
    },
    handleChatInputFocus(focus) {
      if(focus) {
        this.beforeState = this.state
        this.state = CHATINPUT
        return
      }
    },
    async enterChannel(channelInfo) {
      this.channelId = channelInfo['channelId']
      await this.updateChannel(channelInfo)
    },
    async updateChannel(channelInfo) {
      this.channelUsers = (await get('/users', {userIds: channelInfo['users'].join(',')}))
      .filter(user => user.id !== this.user.id)
    },
    async updateChatBox(receivedChat) {
      this.channelChats.push(receivedChat)
    },
    openChat() {
      this.$refs.chat.focus()
    },
    sendChat() {
      this.manager.socket.sendChat(this.user.nickname, this.chatMessage)
      this.chatMessage = ''
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