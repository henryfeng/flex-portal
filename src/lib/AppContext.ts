import RestFetch, {ApiError} from "ticatec-ts-restful-fetch"
import EventEmitter from "eventemitter3";

let fetcher = new RestFetch('');
const emitter = new EventEmitter();

const getFetcher = () => fetcher;

const getRowsPerPage = () => {
    return 25;
}

const appCtx = {
    getFetcher, getRowsPerPage,
    getEmitter: () => emitter
}

export default appCtx



