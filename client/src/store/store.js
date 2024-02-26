import {createStore} from 'vuex';

export var _systemPopupCallback = () => {console.log('stored callback')}

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
    }
  }
});