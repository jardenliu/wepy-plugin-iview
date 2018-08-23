
import merge from 'deepmerge';
import copyIView from './copy';
import injectComponents from './inject';
import px2 from './px2';
import { DEFAULT_CONFIG } from './config';

// check iView is installed or not
try {
    eval("require('iview-weapp/package.json')");
} catch (e) {
    throw new Error('\n 未检测到: iview-weapp \n 您是否安装 iview-weapp ? \n 尝试 npm i -S https://github.com/TalkingData/iview-weapp.git');
}

export default class WepyPluginIView {
    constructor(c = {}) {
        copyIView(); // 拷贝iview到src下
        c = merge(c, { isPx2On: c.config && c.config.px2 })
        this.setting = merge(DEFAULT_CONFIG, c);
        console.log('this.setting', this.setting)
    }
    apply(op) {
        let setting = this.setting;
        const asyncApply = async () => {
            if (setting.isPx2On) {
                op = await px2(op, setting);
            }
            op = injectComponents(op, setting);
        }
        asyncApply().then(() => {
            op.next();
        })
    }
}
