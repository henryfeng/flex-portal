import type Dimension from "./Dimension";

export default interface ServiceData {
    /**
     * 数据分析维度
     */
    dimensions: Array<Dimension>;
    /**
     * 数据值
     */
    data: Array<any>;
}