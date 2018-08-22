const getPageConfigFilter = (pagePath) => {
    let pagePaths = typeof pagePath === 'string' ? [pagePath] : pagePath
    let regs = []
    pagePaths.forEach(path => {
        regs.push(path + '([\\/]|[\\\\]).*json$')  // eslint-disable-line
    })
    return new RegExp(regs.join('|'))
}

export {
    getPageConfigFilter
}

export default {
    getPageConfigFilter
}