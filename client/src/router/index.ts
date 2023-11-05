import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    { path: '/', component: () => import('@/views/Home/HomeIndex.vue') },
    { path: '/Task', component: () => import('@/views/Task/TaskIndex.vue') },
    { path: '/Produce', component: () => import('@/views/Produce/ProduceIndex.vue') },
    { path: '/Room', component: () => import('@/views/Room/RoomIndex.vue') },
    { path: '/User', component: () => import('@/views/User/UserIndex.vue'), meta: { title: '🦄欢迎来到专属用户中心',keepAlive: true } },
    
    { path: '/UserRequire', component: () => import('@/views/Add/UserRequireIndex.vue') },
    { path: '/TaskAdd/:id', component: () => import('@/views/Add/TaskAddIndex.vue') },
    { path: '/ProduceAdd/:id', component: () => import('@/views/Add/ProduceAddIndex.vue') },
    
    { path: '/ProduceDisplay/:id', component: () => import('@/views/display/produceDisplay.vue') },
    { path: '/RoomDisplay/:id', component: () => import('@/views/display/roomDisplay.vue') },
    { path: '/TaskDisplay/:id', component: () => import('@/views/display/taskDisplay.vue') },
    { path: '/UserDisplay/:id', component: () => import('@/views/display/userDisplay.vue') },
    { path: '/setting', component: () => import('@/views/Setting/settingIndex.vue'), meta: { title: '欢迎-来到设置中心' } },
    { path: '/displaySetting', component: () => import('@/views/Setting/displaySetting.vue'), meta: { title: '欢迎-来到海报展示设置中心' } },
    { path: '/display', component: () => import('@/views/display/historyDisplay.vue'), meta: { title: '欢迎-来到总结报告中心' } },
    { path: '/UserDisplay/:id', component: () => import('@/views/display/userDisplay.vue'), meta: { title: '欢迎-来到用户中心' } },
    // 登录
    { path: '/login', component: () => import('@/views/login/loginIndex.vue') },
    // 注册
    { path: '/userAdd', component: () => import('@/views/Add/UserAddIndex.vue') },

    { path: '/test', component: () => import('@/views/Test/TestIndex.vue') },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
