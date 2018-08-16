
import merge from 'deepmerge';
import { getFilter } from './units';
import copyIView from './copy';
import injectComponents from './inject';
import { DEFAULT_CONFIG } from './config';

// check iView is installed or not
try {
    eval("require('iview-weapp/package.json')")
} catch (e) {
    throw new Error('\n 未检测到: iview-weapp \n 您是否安装 iview-weapp ? \n 尝试 npm i -S https://github.com/TalkingData/iview-weapp.git')
}

export default class WepyPluginIView {
    constructor(c = {}) {
        copyIView() // 拷贝iview到src下
        this.setting = merge(DEFAULT_CONFIG, c)
    }
    apply(op) {
        let setting = this.setting;
        let filter = getFilter(setting.pagePath)

        if (filter.test(op.file) && op.type === 'config') {
            op = injectComponents(op, setting);
        }
        op.next()
    }
}