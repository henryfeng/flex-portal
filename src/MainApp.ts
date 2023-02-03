import RestFetch from 'ticatec-ts-restful-fetch';
import appCtx from "./lib/AppContext";
import {setProxy} from "ticatec-ts-enchance-utils";

const initialize = async () => {

    console.debug('系统初始化')

    RestFetch.onError = (ex) => {
        console.warn("访问接口数据发生错误", ex);
        window.Toast.show("ERR", `系统发生错误`);
    }

    const restFetch = appCtx.getFetcher();
    setProxy(restFetch);
}

export {initialize}