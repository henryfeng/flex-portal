import type PortalContext from "../PortalContext";

export const parseScriptEngine = (ctx: PortalContext, utils: any, script: string) : any => {
    try {
        const fun = new Function(`return ${script}`);
        return fun()(ctx, utils);
    } catch (ex) {
        console.error(ex);
        ctx.board.showError('初始化脚本错误');
    }
}

export const parseEChartsScriptEngine = (ctx: PortalContext, echartUtils: any, utils: any, script: string):any => {
    try {
        let funScript =  `return ${script}`;
        let fun = new Function(funScript);
        return fun()(ctx, echartUtils, utils);
    } catch (ex) {
        console.debug('脚本：', script);
        console.error(ex);
        ctx.board.showError('初始化脚本错误');
    }
}