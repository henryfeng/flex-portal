import CommonPaginationService from "./CommonPaginationService";
import {AbstractPaginationDataManager} from "ticatec-ts-enchance-utils";
import type {ValidationResult} from "ticatec-web-validator";
import {createDataValidator} from "ticatec-web-validator";


let rules = [
    {
        field: 'name',
        name: '名称',
        required: true
    },
    {
        field: 'componentCode',
        name: '组件',
        required: false
    },
    {
        field: 'settings',
        name: '参数',
        required: false
    },
    {
        field: 'width',
        name: '宽度',
        type: 'number',
        max: 24,
        required: true
    },
    {
        field: 'height',
        name: '高度',
        required: true
    },
    {
        field: 'script',
        name: '脚本',
        required: false
    },
    {
        field: 'note',
        name: '备注',
        required: false
    }
]

const validator = createDataValidator(rules);
const url = '/flex-dashboard/console/component-frame'

class ComponentFrameService extends CommonPaginationService {

    constructor() {
        super(url);
    }

    /**
     * 校验数据
     * @param item
     */
    validate(item: any):ValidationResult {
        let items=item;
        return validator.validate(item);
    }

    /**
     * 构造一个空对象
     */
    async buildEmptyData(): Promise<any> {
        return {
            name: '',
            componentCode: 'dddd',
            settings: '',
            width: 6,
            height: 4,
            script: '',
            note: '',
            isNew: true
        }
    }


}

const checkSame = (e1: any, e2: any): boolean => e1.id == e2.id;

export const service = new ComponentFrameService();

export default class FrameDataManager extends AbstractPaginationDataManager<ComponentFrameService> {

    constructor() {
        super(service, checkSame);
    }

    protected buildCriteria(): any {
        return {
            name: '',
            componentCode: '',
            componentName: '',
            componentCategory:''
        }
    }

    async remove(item: any): Promise<void> {
        await service.remove(item.id);
        this.removeItem(item);
    }

}