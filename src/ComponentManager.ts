import {getComponentClassList} from "./lib/service/ComponentClassService";
import type {SvelteComponent} from "svelte";

export interface BoardComponent {
    /**
     * 参数
     */
    parameters: string;
    /**
     *
     */
    clazz: SvelteComponent;
}

const components:Map<string, BoardComponent> = new Map();

/**
 * 注册一个新的组件
 * @param code
 * @param parameters
 * @param component
 */
const register = async (code: string, parameters: string, component: SvelteComponent): Promise<void> => {
    try {
        console.debug(`注册编码[${code}]的组件成功：`);
        components.set(code, {parameters, clazz: component});
    } catch (ex) {
        console.error(`无法注册编码[${code}]的组件：`, ex);
    }
}

/**
 * 读取组件
 * @param code
 */
const get = async (code: string):Promise<BoardComponent> => {
    return components.get(code);
}

/**
 * 初始化
 */
const initialize = async ():Promise<void> => {
    let classList = await getComponentClassList();
    for (let clazz of classList) {
        console.debug('注册组件类：', clazz);
        await register(clazz.code,  clazz.parameters, (await import(clazz.source)).default);
    }
}

export default {register, get, initialize};