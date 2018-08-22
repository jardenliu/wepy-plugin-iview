import {
    readdirSync
} from 'fs';
import {
    join,
    resolve,
    relative,
    dirname
} from 'path';
import {
    TARGET_DIR_NAME,
    VERSION_FILE_NAME,
    COMPONENT_IGNORE,
} from './config'

import { getPageConfigFilter } from './units';



// 获取需要注入的组件
const getInjectComponents = (globalConfig, pageConfig) => {
    let targetPath = join('src', TARGET_DIR_NAME)
    let components = readdirSync(targetPath).filter(component => (!COMPONENT_IGNORE[component] && component != VERSION_FILE_NAME))

    let globalInject = globalConfig.inject ? components : [];
    if (typeof globalConfig.inject !== 'boolean')
        globalInject = globalConfig.inject;

    let pageInject = pageConfig.iView;
    return pageInject ? pageInject : globalInject;
}

const injectComponents = (op, setting) => {
    let filter = getPageConfigFilter(setting.pagePath);
    if (filter.test(op.file) && op.type === 'config') {
        let globalConfig = setting.config;
        let pageConfig = JSON.parse(op.code);

        // 将组件注入到json的usingComponents中
        let injectComponents = getInjectComponents(globalConfig, pageConfig); // 获取要注入的组件
        let relativePath = relative(dirname(op.file), resolve('dist/')); // 获取相对的路径
        pageConfig.usingComponents = pageConfig.usingComponents || {};
        injectComponents.forEach(component => (pageConfig.usingComponents[globalConfig.prefix + component] = relativePath + '/' + TARGET_DIR_NAME + '/' + component + '/index'))

        op.code = JSON.stringify(pageConfig)  //更新文件内容
        op.output && op.output({
            action: '变更',
            file: op.file
        })
    }
    return op;
}

export default injectComponents;