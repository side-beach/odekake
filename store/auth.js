export const state = () => ({
  token:null
})

export const getters = {
  isLogined: (state) => !!state.token,
}

export const mutations = {
  setLogin: (state) =>{
    state.token = true;
  }
}

export const actions = {
}