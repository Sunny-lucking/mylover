import { createApp } from 'vue';
import App from './App.vue';
import 'vant/lib/index.css';
import installVantUI from './util/vantUI';
//转向用的
import router from './router';
//标签栏
import { Tabbar, TabbarItem } from 'vant';
//加载图片懒模式
import { Swipe, SwipeItem } from 'vant';
import { NavBar } from 'vant';
import { ContactList } from 'vant';
import { AddressEdit } from 'vant';
import { FloatingBubble } from 'vant';
import { Button } from 'vant';
import { Form, Field, CellGroup } from 'vant';
import { Uploader } from 'vant';
import { Loading } from 'vant';
import { Search } from 'vant';
import { NoticeBar } from 'vant';
import { Dialog } from 'vant';
import { BackTop } from 'vant';
import { TextEllipsis } from 'vant';
import { Slider } from 'vant';
// import { Toast } from 'vant';
// import 'vant/es/toast/style';
import { createPinia } from 'pinia';
import { Toast } from 'vant';
import http from "./../https"




//滑动单元格

export const app = createApp(App);
const state = createPinia();
app.use(Toast);

app.use(state)
app.use(http)
app.use(AddressEdit);
//滑动单元格
//积分和代办栏
app.use(ContactList);
// 主题栏
app.use(NavBar);
app.use(router);//转向用的
//标签栏
app.use(Tabbar);
app.use(TabbarItem);
//加载图片懒模式
app.use(Swipe);
app.use(SwipeItem);

app.use(FloatingBubble);
app.use(Button);

app.use(Form);
app.use(Field);
app.use(CellGroup);

// 加载
app.use(Loading)

// 下载
app.use(Uploader);

// 通知栏
app.use(NoticeBar);

// 搜索
app.use(Search);

// 弹框
app.use(Dialog);

app.use(BackTop);

app.use(TextEllipsis);

app.use(Slider);


installVantUI(app)

export const globalC =  app.config.globalProperties

app.mount('#app');
