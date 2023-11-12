<template>
  <div>
    <router-view />
    <van-loading size="24px" vertical v-if="globalStore.isLoading">加载中...</van-loading>
    <!-- <van-loading vertical v-if="globalStore.isLoading">
      <template #icon>
        <van-icon name="star-o" size="30" />
      </template>
      加载中...
    </van-loading> -->
    <TabBar v-if="isShowTabBar" />
  </div>
</template>
<script>
import jwtDecode from "jwt-decode";
import { useUserStore, useGlobalStore } from './store';
import { useRouter } from "vue-router";
import TabBar from "@/components/TabBar.vue"
import { TAB_ROTER_LIST } from "@/config/common";
import { watch, ref } from 'vue';
export default {
  components: {
    TabBar
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore()
    const globalStore = useGlobalStore()

    const token = localStorage.getItem("jwtToken"); // 从localStorage获取JWT令牌
    if (!token) {
      router.replace("/login");
    }
    const user = jwtDecode(token)
    userStore.setUserInfo(user)
    const isShowTabBar = ref(false);
    // 监听路由的变化
    watch(router.currentRoute, (to, from) => {
      // 根据新的路由信息来更新isShowTabBar的值
      isShowTabBar.value = TAB_ROTER_LIST.includes(to.path);
    });
    return {
      isShowTabBar,
      globalStore,
    }
  }
}

</script>