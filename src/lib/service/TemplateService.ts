import appCtx from "../AppContext";

/**
 * 根据模版id查询模版
 * @param id
 */
const loadTemplate = (id: string): any => {
    return ;//apxCtx.getSysFetcher().get(`/template/${id}`);
}

/**
 * 根据模块名称获取所有可以使用的模版
 * @param mod
 */
const loadByModule = (mod: string): any => {
    return ;//getSysFetcher().get(`/template`, {mod});
}

