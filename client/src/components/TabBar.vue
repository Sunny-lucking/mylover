<template>
    <van-tabbar v-model="active" active-color="#F19290">
        <van-tabbar-item replace to="/Task" icon="coupon-o">任务</van-tabbar-item>
        <van-tabbar-item replace to="/Produce" icon="shop-collect-o">商城</van-tabbar-item>
        <div class="circle-wrapper">
            <van-tabbar-item replace to="/">
                <template #icon="props">
                    <img class="homeIcon" :src="props.active ? icon.active : icon.inactive" />
                </template>
            </van-tabbar-item>
        </div>
        <van-tabbar-item replace to="/Room" icon="cart-o">仓库</van-tabbar-item>
        <van-tabbar-item replace to="/User" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
</template>
<script>
import { ref } from 'vue'
import HomeColor from "@/assets/tabBar/HomeIconColor.jpg";
import HomeGrey from "@/assets/tabBar/HomeIconGrey.jpg";
export default {
    setup() {
        const icon = {
            active: HomeColor,
            inactive: HomeGrey,
        };
        const active = ref(0)
        return {
            icon,
            active
        }
    }
}
</script>
<style scoped>
.circle-wrapper {
    z-index: 2;
}
.van-tabbar-item__icon {
    font-size: 5.9vw;
}

.van-tabbar-item__icon img {
    display: block;
    height: 14vw;
    transform: translateY(-2.7vw);
}
.van-tabbar {
    height: 10vh;
}

</style>