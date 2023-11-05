import { defineStore } from "pinia";
export const useUserStore = defineStore('User', {
    state: () => {
        return {
            userInfo: {}
        }
    },
    getters: {

    },

    actions: {
        setUserInfo(value: any) {
            this.userInfo = value
        }
    }
})