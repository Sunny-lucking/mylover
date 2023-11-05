<template>
  <router-view />
  <TabBar />
</template>
<script>
import jwtDecode from "jwt-decode";
import { useUserStore } from './store';
import { useRouter } from "vue-router";
import TabBar from "@/components/TabBar.vue"
export default {
  components: {
    TabBar
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore()

    const token = localStorage.getItem("jwtToken"); // 从localStorage获取JWT令牌
    if (!token) {
      router.replace("/login");
    }
    const user = jwtDecode(token)
    userStore.setUserInfo(user)
  }
}

</script>