import {createStore} from 'vuex';
import {gsap} from "gsap";
import {_vue_app} from "@/main";

export var _systemPopupCallback = () => {
  console.log('stored callback')
}

export default createStore({
  state() {
    return {
      // system popup
      isSystemPopup: false,
      systemPopupTitle: '',
      systemPopupContent: '',
      systemPopupButton: 'OK',

      // loading
      isLoading: false,
      isSceneChanging: true,
    };
  },
  mutations: {
    showSystemPopup(state, payload) {
      state.isSystemPopup = true
      state.systemPopupTitle = payload.title
      state.systemPopupContent = payload.contents
      state.systemPopupButton = payload.button
      _systemPopupCallback = payload.callback
    },
    hideSystemPopup(state) {
      state.isSystemPopup = false
      state.systemPopupTitle = ''
      state.systemPopupContent = ''
      state.systemPopupButton = 'OK'
    },
    showLoading(state) {
      state.isLoading = true
    },
    hideLoading(state) {
      state.isLoading = false
    },
    showSceneChange(state) {
      state.isSceneChanging = true
    },
    hideSceneChange(state) {
      state.isSceneChanging = false
    }
  },
  actions: {
    showSystemPopup({commit}, payload) {
      commit('showSystemPopup', payload);
    },
    hideSystemPopup(context) {
      context.commit('hideSystemPopup');
    },
    showLoading(context) {
      context.commit('showLoading');
    },
    hideLoading(context) {
      context.commit('hideLoading');
    },
    async showSceneChange(context) {
      return new Promise(resolve => {
        context.commit('showSceneChange')
        _vue_app.$nextTick(() => {
          gsap.to('#overlay', {
            duration: 0.5,
            opacity: 1,
            ease: "power2.out",
            onComplete: resolve
          })
        })
      })
    },
    async hideSceneChange(context) {
      return new Promise(resolve => {
        gsap.to('#overlay', {
          duration: 0.5,
          opacity: 0,
          ease: "power2.in",
          onComplete: () => {
            context.commit('hideSceneChange')
            _vue_app.$nextTick(() => {
              resolve()
            })
          }
        })
      })
    }
  }
});