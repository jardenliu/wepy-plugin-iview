import {
    existsSync,
    readFileSync,
    writeFileSync
} from 'fs';
import { join } from 'path';
import copydir from 'copy-dir';

const IVIEW_PATH = eval("require.resolve('iview-weapp/package.json').replace(/package.json$/, '')");
const IVIEW_VERISON = eval("require('iview-weapp/package.json')").verison;

import {
    IVIEW_SOURCE_DIR,
    TARGET_DIR_NAME,
    VERSION_FILE_NAME
} from './config'

// 复制iView的文件到src中
const copyIViewToSrc = () => {
    let sourcePath = join(IVIEW_PATH, IVIEW_SOURCE_DIR)
    let targetPath = join('src', TARGET_DIR_NAME)
    let versionPath = join('src', TARGET_DIR_NAME, VERSION_FILE_NAME)

    // 检测src目录下的副本
    if (existsSync(targetPath) && existsSync(versionPath)) {
        let copyVersion = readFileSync(versionPath, 'utf-8')
        if (copyVersion === IVIEW_VERISON) return // 比对版本
    }

    copydir.sync(sourcePath, targetPath) // 复制文件夹
    writeFileSync(versionPath, IVIEW_VERISON) // 添加版本文件
    addCopyFolderToGitIgnore() // 把复制过去的文件夹添加.gitignore
}

// 添加git忽略
const addCopyFolderToGitIgnore = () => {
    if (!existsSync('.gitignore')) {
        writeFileSync('.gitignore', 'src/' + TARGET_DIR_NAME + '/')
    } else {
        let ignore = readFileSync('.gitignore', 'utf-8')
        if (!ignore.match('src/' + TARGET_DIR_NAME)) {
            ignore += '\nsrc/' + TARGET_DIR_NAME + '/'
            writeFileSync('.gitignore', ignore)
        }
    }
}

export default copyIViewToSrc;