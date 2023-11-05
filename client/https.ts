const MyHttpServer:any = {}
import axios from 'axios'



//响应拦截
axios.interceptors.request.use(config=>{
    if (localStorage.blogBackToken){
        config.headers.Authorization = localStorage.blogBackToken;
    }
    return config;
},error => {
    return Promise.reject(error)
});

//请求拦截
axios.interceptors.response.use(response=>{
    return response;
},error => {
    const {status} = error.response;
    // if(status==401){
    //     alert('tocken过期,请重新登陆')
    //     localStorage.removeItem("blogBackToken")
    //     // this.$router.push("/login");
    // }else{
    //     alert("这里有错误："+error.response.data);
    
    // }

    return Promise.reject(error);
});

MyHttpServer.install = (app: any) =>{
    app.config.globalProperties.$http = axios
};

export default MyHttpServer
