import { TARGET_DIR_NAME } from './config';

const getPageFilter = (pagePath, fileType) => {
    let pagePaths = typeof pagePath === 'string' ? [pagePath] : pagePath
    let regs = []
    pagePaths.forEach(path => {
        regs.push(path + '([\\/]|[\\\\]).*' + fileType + '$')  // eslint-disable-line
    })
    return new RegExp(regs.join('|'))
}


const getIviewFilter = (fileType, targetPath = TARGET_DIR_NAME) => {
    return new RegExp(`${targetPath}([\\/]|[\\\\]).*\\.${fileType}$`)
}

//page filter
const getPageConfigFilter = (pagePath) => getPageFilter(pagePath, 'json')

// iview filter
const getIviewWxssFilter = () => getIviewFilter('wxss')
const getIviewWxmlFilter = () => getIviewFilter('wxml')

const RPX_RELATIVE = 750;

const getPixelUnitMultiple = (unit, relative) => {
    var result = {
        rpx: RPX_RELATIVE / relative,
        rem: 1 / relative,
        em: 1 / relative,
        px: 1 / relative
    }
    return result[unit] || 1;
}

export {
    getIviewWxssFilter,
    getPageConfigFilter,
    getIviewWxmlFilter,
    getPixelUnitMultiple
}

export default {
    getIviewWxssFilter,
    getPageConfigFilter,
    getIviewWxmlFilter,
    getPixelUnitMultiple
}