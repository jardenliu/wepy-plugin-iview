
const {
    existsSync,
    readFileSync,
    readdirSync,
    writeFileSync
} = require('fs')
const { join } = require('path')
var copydir = require('copy-dir')

const COPY_SOURCE = 'dist'
const COPY_NAME = 'iView'
const COPY_VERSION_FILE_NAME = '.version'

let iviewVersion

try {
    iviewVersion = require('iview-weapp/package.json').version
} catch (e) {
    throw new Error('\n 未检测到: iview-weapp \n 您是否安装 iview-weapp ? \n 尝试 npm i -S https://github.com/TalkingData/iview-weapp.git')
}

function WepyPluginIView(setting = {}) {
    const path = require.resolve('iview-weapp/package.json').replace(/package.json$/, '')

    // 拷贝iview到src下
    copyIViewToSrc()
    //添加ignore
    addCopyFolderToGitIgnore()
    this.setting = setting

    function addCopyFolderToGitIgnore() {
        if (!existsSync('.gitignore')) {
            writeFileSync('.gitignore', 'src/' + COPY_NAME + '/')
        } else {
            let ignore = readFileSync('.gitignore', 'utf-8')
            if (!ignore.match('src/' + COPY_NAME)) {
                ignore += '\nsrc/' + COPY_NAME + '/'
                writeFileSync('.gitignore', ignore)
            }
        }
    }

    function copyIViewToSrc() {
        let sourcePath = join(path, COPY_SOURCE)
        let targetPath = join('src', COPY_NAME)
        let versionPath = join('src', COPY_NAME, COPY_VERSION_FILE_NAME)

        // 检测src的副本
        if (existsSync(targetPath) && existsSync(versionPath)) {
            // 比对版本
            let copyVersion = readFileSync(versionPath, 'utf-8')
            if (copyVersion === iviewVersion) return
        }
        // 复制文件夹
        copydir.sync(sourcePath, targetPath)
        // 添加版本文件
        writeFileSync(versionPath, iviewVersion)
    }
}

function getFilter(pagePath = 'pages') {
    let pagePaths = typeof pagePath === 'string' ? [pagePath] : pagePath
    let regs = []
    pagePaths.forEach(path => {
        regs.push(path + '\/.*json$')
    })
    return new RegExp(regs.join('|'))
}

const DEFAULT_CONFIG = {
    inject: true,
    prefix: 'i-'
}

const COMPONENT_IGNORE = {
    '.version': true,
    'base': true
}

const getInjectComponents = function (globalConfig = {}, pageConfig = {}) {
    let targetPath = join('src', COPY_NAME)
    let components = readdirSync(targetPath).filter(component => !COMPONENT_IGNORE[component])

    let inject
    if (globalConfig.inject && Object.prototype.toString.call(globalConfig.inject) === '[object Array]') {
        inject = globalConfig.inject
    } else if (globalConfig.inject && typeof globalConfig.inject === 'boolean') {
        inject = components
    } else {
        inject = []
    }
    return pageConfig.iView ? pageConfig.iView : inject
}

WepyPluginIView.prototype.apply = function (op) {
    let setting = this.setting
    let filter = getFilter(setting.pagePath)

    if (!filter.test(op.file) || op.type !== 'config') {
        op.next()
    } else {
        let globalConfig = Object.assign({}, DEFAULT_CONFIG, setting.config)
        let pageConfig = JSON.parse(op.code)
        let injectComponents = getInjectComponents(globalConfig, pageConfig)
        pageConfig.usingComponents = pageConfig.usingComponents || {}
        injectComponents.forEach(component => (pageConfig.usingComponents[globalConfig.prefix + component] = '../' + COPY_NAME + '/' + component + '/index'))
        op.code = JSON.stringify(pageConfig)
        // op.output && op.output({
        //   action: '注入iView组件',
        //   file: op.file
        // })
        op.next()
    }
}

module.exports = WepyPluginIView
