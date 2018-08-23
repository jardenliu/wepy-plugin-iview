import postcss from 'postcss';
import px2units from 'postcss-px2units';
import { readFileSync } from 'fs';
import { dirname } from 'path';
import { getIviewWxssFilter, getPixelUnitMultiple, getIviewWxmlFilter } from './units';

const EXCLUDE_WXSS = ['icon'];
const INCLUDE_WXML = ['icon', 'progress'];

const wxssPx2 = (op, setting) => {
    let code = readFileSync(op.file, 'utf-8');
    op.output && op.output({
        action: '变更',
        file: op.file
    });

    let config = Object.assign({}, setting.config.px2, {
        divisor: 1,
        multiple: getPixelUnitMultiple(setting.config.px2.targetUnits, setting.config.px2.relative)
    });

    let prefixer = postcss([px2units(config)]);

    return prefixer.process(code, { from: op.file }).then((result) => {
        op.code = result.css;
        return op;
    }).catch(e => {
        op.err = e;
        op.catch();
        return op;
    });
}

const wxmlPx2 = (op, setting) => {
    let code = readFileSync(op.file, 'utf-8');
    op.output && op.output({
        action: '变更',
        file: op.file
    });
    let multiple = getPixelUnitMultiple(setting.config.px2.targetUnits, setting.config.px2.relative);
    op.code = code.replace(/}}px/g, `*${multiple}}}${setting.config.px2.targetUnits}`);
    return op;
}


const px2 = async (op, setting) => {
    let wxssFilter = getIviewWxssFilter();
    let wxmlFilter = getIviewWxmlFilter();

    if (wxssFilter.test(op.file) && !EXCLUDE_WXSS.includes(dirname(op.file).replace(/^.*([\/]|[\\])/, ''))) {
        op = await wxssPx2(op, setting)
    }

    if (wxmlFilter.test(op.file) && INCLUDE_WXML.includes(dirname(op.file).replace(/^.*([\/]|[\\])/, ''))) {
        op = await wxmlPx2(op, setting)
    }

    return op;
}

export default px2;