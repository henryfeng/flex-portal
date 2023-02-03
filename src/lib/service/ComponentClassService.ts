import appCtx from "../AppContext";

export const getComponentClassList = () => {
    return appCtx.getFetcher().get('/flex-dashboard/service/component-class')
}

