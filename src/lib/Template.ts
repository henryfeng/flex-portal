export interface ComponentClass {
    /**
     * 组件类别编码
     */
    code: string;
    /**
     * 参数
     */
    parameters: any;
}
export interface Component {
    /**
     * 组件编码
     */
    code?: string;
    /**
     * 所属的组件类别
     */
    clazz: ComponentClass;
    /**
     * 标题
     */
    title?: string;
    /**
     * 名称
     */
    name?: string;
    /**
     * 接口地址
     */
    serviceUrl?: string;
    /**
     * 脚本
     */
    script?: string;
}

export interface Frame {
    /**
     *
     */
    frameId: string;
    /**
     * 宽度
     */
    width: number;
    /**
     * 高度
     */
    height: number;
    /**
     * 左上角的横坐标
     */
    posX: number;
    /**
     * 左上角的纵坐标
     */
    posY: number;

}

export interface ComponentFrame extends Frame {
    /**
     * 名称
     */
    name?: string;
    /**
     * 标题
     */
    title?: string;
    /**
     * 组件编码
     */
    component: Component;
    /**
     * 脚本
     */
    script?: string;
    /**
     * 参数
     */
    params?: string;

}


export default interface Template {
    /**
     * 模版的编码
     */
    id: string;
    /**
     * 模版的名称
     */
    name: string;
    /**
     * 显示的标题
     */
    title: string;
    /**
     * 是否是默认的模版
     */
    isDefault: boolean;
    /**
     * 模版的组件和布局
     */
    frames: Array<Frame>
}

