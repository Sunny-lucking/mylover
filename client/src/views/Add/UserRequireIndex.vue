<template>
  <div class="content_useHome">
    <div style="--van-nav-bar-icon-color: #f19290">
      <van-nav-bar
        title="修改用户信息"
        left-text=""
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <!-- <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateY(10px);
      "
    >
      <van-image
        width="65%"
        height="65%"
        fit="cover"
        position="center"
        :src="image"
      />
    </div> -->
    <van-loading vertical v-if="isLoading" class="loading-overlay">
      <template #icon>
        <van-icon name="star-o" size="30" />
      </template>
      加载中...
    </van-loading>

    <van-form @submit="onSubmit">
      <br />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no"
      />
      <van-uploader
        v-model="fileList"
        :after-read="afterRead"
        upload-text="上传头像"
        max-count="1"
      />

      <van-cell-group inset>
        <br />
        <van-field
          v-model="form.name"
          name="更改用户名"
          label="🧩用户名"
          placeholder="更改用户名（选填）"
          clearable
        />
        <van-field
          v-model="form.desc"
          name="更改用户详情"
          label="📝用户详情"
          type="textarea"
          rows="2"
          placeholder="更改用户详情（选填）"
          clearable
        />
        <van-field
          v-model="form.password"
          type="password"
          name="更改密码"
          label="💥更改密码"
          placeholder="更改用户密码（选填）"
          clearable
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block color="#F19290" native-type="submit">
          提交
        </van-button>
        <br />
        <van-button round block type="danger" @click="logout">
          注销账号并退出
        </van-button>
      </div>
    </van-form>
  </div>
  <van-dialog
    v-model:show="show_1"
    title="🥰恭喜"
    message="修改成功！"
    width="70vw"
    height="30vw"
    :show-cancel-button="false"
    :show-confirm-button="false"
  >
  </van-dialog>
  <van-dialog
    v-model:show="show_2"
    @confirm="checkConfirm"
    @cancel="checkCancel"
    title="温馨提示"
    message="😭您确定要注销账号吗，注销账号会清理所有的数据，请您要仔细考虑哦！"
    show-cancel-button
  >
  </van-dialog>
</template>

<script>
import { ref, onMounted,getCurrentInstance } from "vue";
import axios from "axios";
import png from "@/util/useAdd.gif";
import { useRouter } from "vue-router";
// jwt解析插件
import jwtDecode from "jwt-decode";
import { useUserStore } from '../../store';
export default {
  setup() {
    const userStore = useUserStore();
    console.log(userStore.userInfo);
    const image = [png];
    const show_1 = ref(false);
    const show_2 = ref(false);
    const isLoading = ref(false);
    const router = useRouter();
    const formData = new FormData();
    const avatar_url = ref('');
    const { proxy } = getCurrentInstance();

    const form = ref({
        name: '',
        desc: '',
        password: '',
    });
    onMounted(() => {
    });
    const token = localStorage.getItem("jwtToken"); // 从localStorage获取JWT令牌
    if (!token) {
      router.replace("/login");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    let userId = "";
    const checkConfirm = () => {
      isLoading.value = true; // 显示加载中效果
      onLogout();
    };
    const checkCancel = () => {
      return;
    };
    const logout = () => {
      show_2.value = true;
    };
    const onLogout = () => {
      axios
        .put(`/api/deleteUser?id=${userId}`, "", {
          headers,
        })
        .then((response) => {
          // 将响应转换为JSON
          const responseData = response.data;

          // 检查code是否等于1
          if (responseData.code === 1) {
            // 处理完成成功的逻辑
            // 完成成功后重新加载页面
            // 删除本地存储的 token
            localStorage.removeItem("jwtToken");
            // 使用 Vue Router 进行页面跳转到登录页面
            router.replace("/login");
          } else {
            console.error("删除用户失败", responseData);
            // 在这里可以处理其他错误情况
          }
        })
        .catch((error) => {
          // 处理完成失败的逻辑
          console.error("删除用户失败", error);
        });
    };

    const onClickLeft = () => router.replace("/Setting");


    const username = ref("");
    const desc = ref("");
    const password = ref("");
    const fileList = ref([]);
    let imageUrl = ref("");

    const afterRead = (file) => {
      file.status = "uploading";
      file.message = "上传中...";
      formData.append("avatar", file.file);
      avatar_url.value = URL.createObjectURL(file.file)
      fileList.value = [{url: avatar_url.value, isImage: true}]
    };
    const onSubmit = () => {
      // 创建包含参数的请求体
      formData.append('name', form.value.name),
      formData.append('desc', form.value.desc),
      formData.append('password', form.value.password),
      formData.append('_id', userStore.userInfo._id)

      isLoading.value = true;
      // 发送 POST 请求到指定的 URL
      proxy.$http.post("/api/user/edit", formData)
        .then((response) => {
          console.log(response.data);
          try {
            show_1.value = true;
            // // 等待3秒后执行路由跳转
            // setTimeout(() => {
            //   router.replace("/");
            // }, 1000);
          } catch (error) {
            console.error("请求requireUser接口失败", error);
          }
        })
        .catch((error) => {
          console.error("请求requireUser接口失败", error);
          // 处理请求失败的情况
        });
      isLoading.value = false;
    };

    return {
      show_1,
      show_2,
      image,
      onClickLeft,
      checkConfirm,
      checkCancel,
      logout,
      username,
      desc,
      password,
      onSubmit,
      fileList,
      afterRead,
      form
    };
  },
};
</script>

<style>
.van-uploader {
  position: relative;
  display: inline-block;
  /* transform: translateX(158px); */
  display: flex;
  justify-content: center;
}

.content_useHome {
  zoom: 1;
  /* 禁止页面内容缩放 */
  height: 100%;
  width: 100%;
  overflow-y: auto;
  /* 显示垂直滚动条 */
  overflow-x: hidden;
  /* 隐藏水平滚动条 */
}

.image-slider {
  justify-content: center;
}

.van-dialog__confirm, .van-dialog__confirm:active {
    color: #f19290;
}
</style>