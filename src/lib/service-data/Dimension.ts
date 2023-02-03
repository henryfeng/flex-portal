export interface DimensionItem {
    /**
     * 分析维度值
     */
    code: string;
    /**
     * 分析维度表达文字
     */
    text: string;
}

export default interface Dimension {
    /**
     * 维度编码
     */
    code: string;
    /**
     * 维度名称
     */
    name: string;
    /**
     * 维度数据
     */
    data: Array<DimensionItem>

}