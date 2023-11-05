<template>
  <div class="content_displaySetting">
    <meta name="viewport"
      content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no" />
    <div style="--van-nav-bar-icon-color: #f19290">
      <van-nav-bar title="海报展示设置中心" left-text="" left-arrow @click-left="onClickLeft" />
    </div>

    <div style="
        transform: translate(5vw, 7vh);
        position: relative;
        overflow: hidden;
        cursor: grab;
        background-color: #fff;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
        border-radius: 20px;
        width: 90%;
      ">
      <div style="margin-top: 2vh; margin-bottom: 2vh">
        <van-cell center title="海报展示设置"> </van-cell>
        <van-cell-group inset>
          <van-cell title="海报事件名称" :label="form.event_title" is-link @click="onEdit('event_title')" />

          <van-cell title="海报事件时间" :label="form.time" is-link @click="onEdit('time')" />

          <van-cell title="海报名称" :label="form.title" is-link @click="onEdit('title')" />

          <van-cell title="海报二维码内容" :label="form.url" is-link @click="onEdit('url')" />
        </van-cell-group>
      </div>
    </div>
  </div>
  <van-dialog v-model:show="show_1" :show-cancel-button="false" :show-confirm-button="false" width="50vw">
    <br />
    <br />
    <van-loading size="40px" vertical text-size="15px" color="#f19290">🚀拼命加载中...</van-loading>
    <br />
    <br />
  </van-dialog>

  <van-dialog v-model:show="show_2" title="🥰提示" :message="message" width="70vw" height="30vw"
    :close-on-click-overlay="true" :show-cancel-button="false" :show-confirm-button="false">
  </van-dialog>
  <van-dialog v-model:show="showDialog" :title="dialogTitle" @confirm="userCheckConfirm" @cancel="userCheckCancel"
    show-cancel-button>
    <div style="margin-top: 3vh; margin-bottom: 4vh">
      <van-cell-group inset>
        <van-cell-group inset>
          <van-field v-model="userValue" rows="3" autosize :label="dialogLabel" type="textarea" :maxlength="maxlength"
            :placeholder="dialogPlaceholder" show-word-limit />
        </van-cell-group>
      </van-cell-group>
    </div>
  </van-dialog>
</template>
  
<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useUserStore } from '@/store'
export default {
  setup() {
    const userStore = useUserStore();
    const { proxy } = getCurrentInstance();
    const form = ref({});
    const dialogType = ref(null)
    const displayUrl = ref("");
    const displayLogo = ref("");
    const displayItem = ref("");
    const displayDay = ref("");
    const userData = ref("");
    const dialogTitle = ref("");
    const dialogLabel = ref("");
    const maxlength = ref("");
    const dialogPlaceholder = ref("");
    const userValue = ref("");
    const message = ref("");
    const userId = ref("");
    const show_1 = ref(false);
    const show_2 = ref(false);
    const showDialog = ref(false);
    const router = useRouter();

    onMounted(() => {
      show_1.value = true;
      fetchDataAndFillForm();
    });
    const onSetForm = (key, value) => {
      form.value[key] = value
    }
    const fetchDataAndFillForm = async () => {
      try {
        proxy.$http.get(`/api/poster/detail?owner_id=`+ userStore.userInfo._id).then((response) => {
          if (response.data.code === 0) {
            const poster = response.data.poster;
            form.value.title = poster.title;
            form.value.event_title = poster.event_title;
            form.value.url = poster.url;
            form.value.time = poster.time;
          } else {
            form.value.title = '';
            form.value.event_title = '';
            form.value.url = '';
            form.value.time = '';
          }
        });
      } catch (error) {
        console.error("获取数据失败", error);
      }
      show_1.value = false;
    };
    const formMap = {
      event_title: {
        title: "修改海报事件名称",
        label: "海报事件名称",
        maxlength: 7,
        placeholder: "请输入事件名称",
      },
      time: {
        title: "修改海报事件起始时间",
        label: "海报事件起始时间",
        maxlength: 20,
        placeholder: "请输入海报事件起始时间（例如：2022-10-06）",
      },
      title: {
        title: "修改海报Logo名称",
        label: "海报Logo名称",
        maxlength: 10,
        placeholder: "请输入海报Logo名称",
      },
      url: {
        title: "修改海报二维码链接",
        label: "海报二维码链接",
        maxlength: 50,
        placeholder: "请输入海报二维码链接",
      }
    }
    const onEdit = (type) => {
      dialogTitle.value = formMap[type].title;
      dialogLabel.value = formMap[type].label;
      maxlength.value = formMap[type].maxlength;
      dialogPlaceholder.value = formMap[type].placeholder;
      showDialog.value = true;
      dialogType.value = type;
      return;
    };

    const userCheckConfirm = async () => {

      form.value[dialogType.value] = userValue.value
      const params = {
        owner_id: userStore.userInfo._id,
        title: form.value.title,
        event_title: form.value.event_title,
        time: form.value.time,
        url: form.value.url
      }
      // 发送 POST 请求到指定的 URL
      const res = await proxy.$http.post('/api/poster/edit', params);
      if (res.data.code === 0) {
        message.value = "保存成功";
      }
      show_2.value = true; // 显示
      // 等待两秒后执行关闭操作
      setTimeout(() => {
        show_2.value = false; // 关闭
      }, 1000); // 2000毫秒等于2秒
      userValue.value = "";
    };

    const userCheckCancel = () => {
      userValue.value = "";
      return;
    };

    const onClickLeft = () => router.replace("/Setting");
    return {
      form,
      dialogType,
      dialogTitle,
      dialogLabel,
      dialogPlaceholder,
      maxlength,
      onEdit,
      displayUrl,
      displayLogo,
      displayItem,
      displayDay,
      userValue,
      userData,
      userId,
      show_1,
      show_2,
      showDialog,
      onClickLeft,
      message,
      userCheckConfirm,
      userCheckCancel,
    };
  },
};
</script>
  
<style>
.content_displaySetting {
  background-image: url("../../assets/image/setting.jpg");
  zoom: 1;
  /* 禁止页面内容缩放 */
  width: 100vw;
  /* 设置容器宽度 */
  height: 100vh;
  /* 设置容器高度，使其占满整个视口 */
  overflow-y: auto;
  /* 显示垂直滚动条 */
  overflow-x: hidden;
  /* 隐藏水平滚动条 */
  background-size: cover;
  background-position: center -70px;
}

.van-dialog__confirm,
.van-dialog__confirm:active {
  color: #f19290;
}

:root {
  --van-gray-3: #ffffff;
}

.van-picker__confirm {
  color: #f19290;
}
</style>