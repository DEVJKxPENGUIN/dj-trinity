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
          <p class="color-desc font-desc orbitron-thin">{{ item.title }}</p>
          <p class="color-desc font-desc orbitron-thin">{{ item.count }}</p>
          <p class="color-desc font-desc orbitron-thin">{{ item.size }}</p>
        </div>
      </div>
    </template>

  </Popup>
</template>

<script>
import {mapState} from "vuex";
import Popup from "@/scene/common/popup.vue";

export default {
  name: "GameLoading",
  components: {Popup},
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
  },
  data() {
    return {}
  },
  methods: {}
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