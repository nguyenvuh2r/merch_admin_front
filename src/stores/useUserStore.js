import { ref } from 'vue';
import { defineStore } from 'pinia';

const useUserStore = defineStore('auth', () => {
  const user = ref(null)

  const setUser = (authUser) => {
    user.value = authUser
  }

  return {
    user,
    setUser
  }
})

export default useUserStore
