const MyHttpServer: any = {}
import axios from 'axios'
import { useGlobalStore } from "@/store";
import { globalC } from "@/main";

// import { showLoadingToast } from 'vant';
import 'vant/es/toast/style';
// showToast("ss")

// import 'vant/es/show-toast/style'
// import 'vant/lib/toast/style';
// app.use(showToast);

//响应拦截
axios.interceptors.request.use(config => {
    const globalStore = useGlobalStore();
    // globalC.$toast({
    //     message: 'yes'
    // })
    
    // globalC.$toast('哈哈哈');
    // Toast('加载中...');
    globalStore.setLoading(true)
    // if (localStorage.blogBackToken) {
    //     config.headers.Authorization = localStorage.blogBackToken;
    // }
    return config;
}, error => {
    return Promise.reject(error)
});

//请求拦截
axios.interceptors.response.use(response => {
    const globalStore = useGlobalStore();


    globalStore.setLoading(false)
    return response;
}, error => {
    // const {status} = error.response;
    // if(status==401){
    //     alert('tocken过期,请重新登陆')
    //     localStorage.removeItem("blogBackToken")
    //     // this.$router.push("/login");
    // }else{
    //     alert("这里有错误："+error.response.data);

    // }

    return Promise.reject(error);
});

MyHttpServer.install = (app: any) => {
    app.config.globalProperties.$http = axios
};

export default MyHttpServer
