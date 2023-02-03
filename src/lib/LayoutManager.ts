import type {Frame} from "./Template";
import type Template from "./Template";

export default class LayoutManager {

    #frames: Array<Frame>;
    #cells:Array<Array<number>>;

    constructor(template: Template) {
    }

    private sortedFrames(frames: Array<Frame>):void {
        let maxRow = 0;
        frames.forEach(frame => {
            const bottom = frame.posY + frame.height;
            if (bottom > maxRow) {
                maxRow = bottom;
            }
        });
        this.#cells = this.createEmptyCells(maxRow);
    }

    /**
     * 建立一个新的空单元格
     * @param rows
     * @private
     */
    private createEmptyCells(rows: number):Array<Array<number>> {
        let cells:Array<Array<number>> = [];
        for (let i:number=0; i<rows; i++) {
            let row:Array<number> = [];
            for (let j:number=0; j<24; j++) {
                row.push(0);
            }
            cells.push(row);
        }
        return cells;
    }

    /**
     * 根据组件所占的单元格进行填充
     * @param frames
     * @private
     */
    private fillingComponent(frames: Array<Frame>): void {
        frames.forEach(frame=>{
            for (let i=frame.posY; i<frame.posY+frame.height; i++) {
                let row = this.#cells[i-1];
                for (let j=frame.posX; j<frame.posX+frame.width; j++) {
                    row[j-1] = row[j-1] + 1;
                }
            }
        })
    }


}