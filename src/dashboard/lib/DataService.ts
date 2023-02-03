import appContext from "../../lib/AppContext";
let serviceProxy = appContext.getFetcher();


const toQueryPath = (params: any): string => {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        // @ts-ignore
        searchParams.append(key, value);
    }
    return searchParams.toString();
}

class DataService {

    async getData(url: string, params: any = null): Promise<any> {
        const queryPath = params == null ? null : toQueryPath(params);
        if (queryPath != null) {
            if (url.indexOf('?') > 0) {
                url += '&' + queryPath;
            } else {
                url += '?' + queryPath;
            }
        }
        if (serviceProxy == null) {
            throw new Error('Havn\'t initialize service proxy');
        }
        return await serviceProxy.get("/flex-data" + url);
    }

}

const dataService = new DataService();

export default dataService;