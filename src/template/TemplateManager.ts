
import CommonPaginationService from "./CommonPaginationService";
import {AbstractPaginationDataManager} from "ticatec-ts-enchance-utils";
import type {ValidationResult} from "ticatec-web-validator";
import {createDataValidator} from "ticatec-web-validator";
import type {TemplateLayout} from "./Entities";


const checkSame = (e1: any, e2: any): boolean => e1.id == e2.id;


let rules = [
    {
        field: 'id',  /*由字母，数字，-和_组成*/
        name: '编码',
        required: true,
        minLen: 3,
        regex: /^[a-zA-Z0-9_-]*$/
    },
    {
        field: 'name',
        name: '模板名称',
        required: true
    },
    {
        field: 'category',  /*由字母，数字，-和_组成*/
        name: '类别',
        required: true,
        minLen: 5,
        regex: /^[a-zA-Z0-9_-]*$/
    },
    {
        field: 'ownerCode',
        name: '属主编码',
        required: true
    },

];
const validator = createDataValidator(rules);

class TemplateService extends CommonPaginationService {
    constructor() {
        super('/flex-dashboard/console/template');
    }

    /**
     * 对新增数据源的数据初始化
     */
    async buildEmptyData(): Promise<any> {
        return {
            id: 'tmp1',
            name: '模板1',
            category: 'qmsptsplan',
            isPrivate: false,
            ownerCode:'x',
            enable:false,
            note: '',
            components:[],
            isNew: true
        }
    }

    /**
     * 查验数据是否符合条件
     * @param item
     */
    validate(item: any): ValidationResult {
        return validator.validate(item);

    }

    async load(id:string):Promise<any>{
        return await this.getService().get(`${this.url}/${id}`);
    }

    async saveLayout(item:any){
        return await this.getService().put(`${this.url}/updateLayoutList/${item.id}`,item.components);
    }

    async saveLayout2(templateId:string, layoutList:Array<TemplateLayout>){
        return await this.getService().put(`${this.url}/updateLayoutList/${templateId}`,layoutList);
    }

    async loadTemplate(userPath:string, modCode:string):Promise<any>{
        return await this.getService().get(`${this.url}/load4user`, {userPath,modCode});
    }

    async cloneUserTemplate(userCode:string, templateId:string):Promise<any>{
        return await this.getService().post(`${this.url}/clone4user`, {userCode,templateId});
    }
}



export const service = new TemplateService();

export default class TemplateManager extends AbstractPaginationDataManager<TemplateService> {

    constructor() {
        super(service, checkSame);
    }

    /**
     * 构建初始化的查询条件，包括编码，名称，类别和是否动态，*代表所有的
     * @protected
     */
    protected buildCriteria(): any {
        return {
            id: '',
            name: '',
            category: '',
        }
    }

    /**
     * 删除一条记录
     * @param item
     */
    async remove(item: any): Promise<void> {
        await this.service.remove(item.id);
        super.removeItem(item);
    }

}