<template>
    <div class="content_task">

        <van-swipe :autoplay="3000">
            <van-swipe-item v-for="image in images" :key="image">
                <img :src="image" style="width: 100%; height: 250px;" />
            </van-swipe-item>
        </van-swipe>
        <van-loading vertical v-if="isLoading">
            <template #icon>
                <van-icon name="star-o" size="30" />
            </template>
            加载中...
        </van-loading>

        <form action="/">
            <meta name="viewport"
                content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no" />
            <van-search v-model="keyWord" placeholder="请输入搜索关键词" @search="onSearch" />
        </form>

        <van-floating-bubble v-model:offset="offset_task" axis="xy" icon="add-o" @click="onAddTask" />

        <h1>💪 未完成任务
            <van-icon name="coupon-o" :badge="toDoTaskList.length.toString()" :badge-props="{ color: '#ee575e' }" />
        </h1>
        <div v-for="(item, index) in toDoTaskList" :key="index">
            <van-swipe-cell>
                <van-card :price="item.credit" :desc="item.desc" :title="item.name" class="goods-card"
                    :thumb="userStore.userInfo.avatar_url" currency="💰" :thumb-link="`/#/TaskDisplay/${item._id}`">

                    <template #tags>
                        <van-tag plain color="#F19290">{{ item.target[0].name }}</van-tag>
                        <van-tag plain color="#F19290">执行</van-tag>
                    </template>

                    <template #footer>
                        <van-button size="mini" @click="showThanksDialog()">👑</van-button>
                    </template>
                </van-card>
                <template #right>
                    <van-button square text="完成" color="#8EB982" class="completed-button" @click="completedItem(item)" />
                    <van-button square text="删除" color="#F19290" class="delete-button"
                        @click="deleteTaskItem(item, TASK_TYPE.TODO)" />
                </template>

                <!-- </van-card> -->
            </van-swipe-cell>
        </div>

        <div class="separator"></div>

        <h1>🥰 完成任务
            <van-icon name="coupon-o" :badge="doneTaskList.length.toString()" :badge-props="{ color: '#ee575e' }" />
        </h1>
        <div v-for="(item, index) in doneTaskList" :key="index">
            <van-swipe-cell>
                <van-card :price="item.credit" :desc="item.desc" :title="item.name" class="goods-card"
                    :thumb="userStore.userInfo.avatar_url" currency="💰" :thumb-link="`/#/TaskDisplay/${item.taskId}`">
                    <template #tags>
                        <van-tag plain color="#F19290">{{ item.target[0].name }}</van-tag>
                        <van-tag plain color="#F19290">执行</van-tag>
                    </template>

                    <template #footer>
                        <van-button size="mini" @click="showThanksDialog()">🌈</van-button>
                    </template>
                </van-card>

                <template #right>
                    <van-button square text="删除" color="#F19290" class="delete-button"
                        @click="deleteTaskItem(item, TASK_TYPE.DONE)" />
                </template>


            </van-swipe-cell>
        </div>
        <van-dialog v-model:show="isShowToDeleteDialog" @confirm="handleDeleteConfirm" @cancel="handleCancel"
            title="🥰 温馨提示" message="🦄您确定要删除这个任务吗，删除之后就找不到咯，请您要仔细认真考虑哦！" show-cancel-button>
        </van-dialog>
        <van-dialog v-model:show="isShowToDoneDialog" @confirm="handleCompletedConfirm" @cancel="checkCancel"
            title="🥰 温馨提示" message="🦄您确定您完成了这个任务了吗？" show-cancel-button>
        </van-dialog>
        <!-- 其他内容 -->
        <van-back-top right="83vw" bottom="10vh" />
    </div>

    <!-- 弹出层 -->
    <van-dialog v-model:show="isShowThanksDialog" title="💖 感谢您的心心 💖" width="308" show-cancel-button>
        <img src="https://www.yyandywt99.love/ybb/v2-0b6360bf3879ad4ebf8a8e8052634042_b.webp" />
    </van-dialog>

    <van-dialog v-model:show="isShowDeleteDialog" title="🥰 温馨提示" message="😂您不能删除别人创建的任务哦，快去完成自己的任务吧！">
    </van-dialog>

    <van-dialog v-model:show="isShowDoneDialog" title="🥰 温馨提示" message="😂您不能完成别人创建的任务哦，快去完成自己的任务吧！">
    </van-dialog>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import { TASK_TYPE } from './config.ts'
import { useRouter } from 'vue-router';
// jwt解析插件
import jwtDecode from 'jwt-decode';
import { useUserStore } from '@/store'

export default {
    setup() {
        const userStore = useUserStore()
        const { proxy } = getCurrentInstance();
        const isShowToDeleteDialog = ref(false);
        const isShowToDoneDialog = ref(false);
        const isShowThanksDialog = ref(false);
        const isShowDeleteDialog = ref(false);
        const isShowDoneDialog = ref(false);
        const actionTask = ref(null);
        const active = ref(1);
        const router = useRouter();
        const isLoading = ref(true); // 初始时显示加载中效果
        const images = [
            'https://www.yyandywt99.love/yy2/MissionCover03.jpg',
            'https://www.yyandywt99.love/yy2/MissionCover03.jpg',
            'https://www.yyandywt99.love/yy2/MissionCover03.jpg',
        ];

        const offset_task = ref({ x: 300, y: 520 });
        const onAddTask = () => {
            window.location.href = "#/TaskAdd/1";
        };

        const doneTaskList = ref([]);
        const toDoTaskList = ref([]);
        const keyWord = ref('');
        const onSearch = async (val) => {
            isLoading.value = true;
            const keyWord = val
            const params = {
                keyWord
            }
            doneTaskList.value = await getTaskList({ ...params, isDone: true });
            toDoTaskList.value = await getTaskList({ ...params, isDone: false })
        };

        onMounted(() => {
            onSearch(keyWord.value);
        });
        const token = localStorage.getItem('jwtToken'); // 从localStorage获取JWT令牌
        if (!token) {
            router.push('/login');
        }
        let owner = ref(null);
        owner.value = jwtDecode(token)
        const getTaskList = async (params) => {
            const res = await proxy.$http.get(`/api/task/list`, { params })
            isLoading.value = false;
            return res.data.tasks;
        };
        const deleteTask = async () => {
            isLoading.value = true;
            const params = {
                _id: actionTask.value._id,
            }
            const res = await proxy.$http.post(`/api/task/delete`, params);
            isLoading.value = false;
            if (res.data.code === 0) {
                if (actionTask.value.taskType === TASK_TYPE.DONE) {
                    const index = doneTaskList.value.findIndex(item => item._id === actionTask.value._id);
                    doneTaskList.value.splice(index, 1); // 从数组中移除任务项
                }
                if (actionTask.value.taskType === TASK_TYPE.TODO) {
                    const index = toDoTaskList.value.findIndex(item => item._id === actionTask.value._id);
                    toDoTaskList.value.splice(index, 1); // 从数组中移除任务项
                }
            }
        }
        const deleteTaskItem = (item, taskType) => {
            if (owner.value._id === item.owner_id) {
                item.taskType = taskType
                actionTask.value = item
                isShowToDeleteDialog.value = true;
            } else {
                isShowDeleteDialog.value = true;
            }
        };
        const handleDeleteConfirm = () => {
            deleteTask()
        }
        const handleCancel = () => {
            return;
        }

        const completedTask = async () => {
            isLoading.value = true;
            const params = {
                _id: actionTask.value._id,
            }
            const res = await proxy.$http.post(`/api/task/complete`, params);
            isLoading.value = false;
            if (res.data.code === 0) {
                const index = toDoTaskList.value.findIndex(item => item._id === actionTask.value._id);
                const item = toDoTaskList.value.splice(index, 1); // 从数组中移除任务项
                doneTaskList.value.unshift(item[0]); // 从数组中移除任务项
            }
        }
        const handleCompletedConfirm = () => {
            completedTask()
        }
        const completedItem = (item) => {
            if (owner.value._id === item.owner_id) {
                actionTask.value = item
                isShowToDoneDialog.value = true;
            } else {
                isShowDoneDialog.value = true;
            }
        };
        const checkConfirm = () => {
        }
        const checkCancel = () => {
            return;
        }
        const showThanksDialog = () => {
            isShowThanksDialog.value = true;
        }


        return {
            userStore,
            deleteTaskItem,
            isShowToDeleteDialog,
            isShowToDoneDialog,
            isShowThanksDialog,
            isShowDeleteDialog,
            isShowDoneDialog,
            showThanksDialog,
            owner,
            isLoading,
            keyWord,
            doneTaskList,
            toDoTaskList,
            actionTask,
            handleDeleteConfirm,
            handleCompletedConfirm,
            handleCancel,
            checkConfirm,
            checkCancel,
            completedItem,
            offset_task,
            onAddTask,
            onSearch,
            active,
            images,
            TASK_TYPE,
        };
    },

};

</script>
<style>
.content_task {
    zoom: 1;
    /* 禁止页面内容缩放 */
    width: 100%;
    /* 设置容器宽度 */
    height: 92vh;
    /* 设置容器高度，使其占满整个视口 */
    overflow-y: auto;
    /* 显示垂直滚动条 */
    overflow-x: hidden;
    /* 隐藏水平滚动条 */
}

.notice-swipe {
    height: 40px;
    line-height: 40px;
}

.van-floating-bubble {
    width: 50px;
    height: 50px;
}

.van-floating-bubble__icon {
    font-size: 30px;
}

h1 {
    transform: translateX(2vw);
    font-size: 20px;
    color: #ff66cc;
}

.van-back-top {
    background-color: #B95B66;
}

.delete-button {
    height: 100%;
}

.van-card {
    background: white;
}

.van-floating-bubble {
    background: #F19290;

}

.completed-button {
    height: 100%;
}
</style>
