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
export const useGlobalStore = defineStore('Global', {
    state: () => {
        return {
            loading: false
        }
    },
    getters: {

    },

    actions: {
        setLoading(value: any) {
            this.loading = value
        }
    }
})