<template>
  <Popup
      :show="true"
      blur="backdrop-blur-sm"
  >
    <template #text>
      <div class="loading-title anta-regular">
        {{ bmsCurrent.bmsHeader.title }}
      </div>
    </template>

    <template #form>

      <!-- LOADING STATE -->
      <div class="flex flex-col w-4/6 orbitron-regular">
        <div v-for="item in loadState" v-bind:key="item" class="flex flex-col color-main w-full">
          <p class="color-desc font-desc orbitron-thin">{{ toUpperCase(item.title) }}</p>
          <div class="flex flex-row h-2">
            <GameLoadingBar :total="item.size" :current="item.count"/>
            <p class="flex color-desc font-desc orbitron-thin items-center">[{{ item.count }}</p>
            <p class="flex color-desc font-desc orbitron-thin items-center">/</p>
            <p class="flex color-desc font-desc orbitron-thin items-center">{{ item.size }}]</p>
          </div>

        </div>
      </div>
    </template>

  </Popup>
</template>

<script>
import {mapState} from "vuex";
import Popup from "@/scene/common/popup.vue";
import {toUpperCase} from "uri-js/dist/esnext/util";
import GameLoadingBar from "@/scene/game/GameLoadingBar.vue";

export default {
  name: "GameLoading",
  components: {GameLoadingBar, Popup},
  computed: {
    ...mapState(['isLoading', 'isSystemPopup'])
  },
  props: {
    bmsCurrent: {
      type: Object,
      default: () => {
      }
    },
    loadState: {
      type: Array,
      default: () => []
    }
  },
  created() {
    this.checkLoadFinished = setInterval(() => {
      for (let i = 0; i < this.loadState.length; i++) {
        const item = this.loadState[i]
        if (item.size !== item.count) {
          return
        }
      }

      // finished checking all loadState completed
      this.$emit('close')
    }, 2000)
  },
  data() {
    return {
      checkLoadFinished: null
    }
  },
  methods: {toUpperCase},
  beforeUnmount() {
    clearInterval(this.checkLoadFinished)
  }
}
</script>

<style scoped>
.loading-title {
  font-size: 40px;
  color: white;
}

.color-main {
  color: rgba(255, 255, 255, .9);
}

.color-desc {
  color: rgba(255, 255, 255, 0.6);
}

.font-desc {
  font-size: 10px;
}

</style>