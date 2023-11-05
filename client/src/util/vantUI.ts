import { Toast } from 'vant';
import { Notify } from 'vant';

function installVantUI(app: any) {
    app.config.globalProperties.$toast= Toast
    app.use(Toast)
    app.use(Notify)
}
export default installVantUI