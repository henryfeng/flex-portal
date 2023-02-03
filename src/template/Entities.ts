export interface Frame {

    /**
     * 主键
     */
    id: string;
    /**
     * 名称
     */
    name: string;
    /**
     * 首页组件编码
     */
    componentCode: string;
    /**
     * 首页组件名称
     */
    componentName?: string;
    /**
     * 首页组件类别编码
     */
    classCode?: string;
    /**
     * 设置参数
     */
    settings: string;
    /**
     * 宽度
     */
    width: number;
    /**
     * 高度
     */
    height: number;
    /**
     * 脚本
     */
    script: string;
    /**
     * 备注
     */
    note: string;

    /**
     * 首页组件类型
     */
    componentCategory?: string;

    /**
     * 首页组件脚本
     */
    componentScript?: string;

    /**
     * 首页组件的serviceUrl
     */
    serviceUrl?: string;

    /**
     *首页组件cls的参数
     */
    classParameters?: string;
}


export interface Template {
    /**
     *
     */
    id: string;
    /**
     *
     */
    ownerCode: string;
    /**
     *
     */
    name: string;
    /**
     *
     */
    isPrivate: boolean;
    /**
     *
     */
    category: string;
    /**
     *
     */
    enable: boolean;
    /**
     *
     */
    note?: string;
    /**
     *
     */
    components?: Array<TemplateLayout>;

    default?:boolean;

    isNew?: boolean;
}

export interface TemplateLayout {

    /**
     *
     */
    templateId?: string;
    /**
     *
     */
    frameId: string;
    /**
     *
     */
    posX: number;
    /**
     *
     */
    posY: number;
    /**
     *
     */
    width: number;
    /**
     *
     */
    height: number;

}

export interface DivInGrid{
    posX:number;
    posY:number;
    backgroundColor?:boolean;
}