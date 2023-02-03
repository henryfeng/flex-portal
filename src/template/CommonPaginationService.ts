import {AbstractPaginationDataService} from "ticatec-ts-enchance-utils";
import type {PaginationList} from "ticatec-ts-enchance-utils";


export default class CommonPaginationService extends AbstractPaginationDataService {
    protected readonly url: string;

    constructor(url: string) {
        super();
        this.url = url;
    }

    async save(data: any, isNew: boolean): Promise<any> {
        if (isNew) {
            return await this.getService().post(this.url, data);
        } else {
            return await this.getService().put(this.url, data);
        }
    }


    async search(criteria: any): Promise<PaginationList> {
        return await this.getService().get(this.url, criteria);
    }

    async getSummaryList():Promise<any>{
        return await this.getService().get(this.url);
    }

    /**
     * 删除一个组件类别
     * @param key
     */
    async remove(key: string): Promise<any> {
        return await this.getService().del(`${this.url}/${key}`);
    }

}