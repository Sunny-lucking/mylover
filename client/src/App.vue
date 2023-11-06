<template>
  <div>
    <router-view />
    <TabBar v-if="isShowTabBar" />
  </div>
</template>
<script>
import jwtDecode from "jwt-decode";
import { useUserStore } from './store';
import { useRouter } from "vue-router";
import TabBar from "@/components/TabBar.vue"
import { TAB_ROTER_LIST } from "@/config/common";
import { computed,watch,ref } from 'vue';
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
    console.log(router.options.history.location);
    const user = jwtDecode(token)
    userStore.setUserInfo(user)
    console.log(TAB_ROTER_LIST);
    const isShowTabBar =  ref(false);
    // 监听路由的变化
    watch(router.currentRoute, (to, from) => {
      // 根据新的路由信息来更新isShowTabBar的值
      isShowTabBar.value = TAB_ROTER_LIST.includes(to.path);
    });
    console.log(isShowTabBar.value);
    return {
      isShowTabBar

    }
  }
}

</script>