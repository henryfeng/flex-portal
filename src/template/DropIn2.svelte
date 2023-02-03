<script lang="ts">

    import type {DivInGrid, TemplateLayout} from "./Entities";
    import {createEventDispatcher} from "svelte";

    const dispatcher = createEventDispatcher();
    // 模板的布局被分成几行几列
    export let rowCount = 14, colCount = 24;
    // 要添加上来的新的控件
    export let newComponent: TemplateLayout;
    export let canDrop: boolean = false;

    // 用来显示那些接收拖动控件进来的一个一个的小单元格div
    let dropDivRows: Array<Array<DivInGrid>> = [];

    $:if(rowCount > 0){
        // rowCount会随着内容增加而变大，这边也要改
        mkDropDivRows();
    }

    function mkDropDivRows(){
        dropDivRows.splice(0,dropDivRows.length);
        // 注意，是从0开始的。因为是我们的坐标系posX posY要用它。
        for (let posY = 0; posY < rowCount; posY++) {
            let row: Array<DivInGrid> = [];
            for (let posX = 0; posX < colCount; posX++) {
                row.push({posX, posY, backgroundColor: false})
            }
            dropDivRows.push(row)
        }
    }

    function dragover(ev) {
        // 默认的操作是不允许入进来的，所以要屏蔽一下，变为可放进来
        ev.preventDefault();
    }

    // 拖进来的新控件的起始位置
    let xStart, yStart;
    function dragenter(cell: DivInGrid) {
        let cx = cell.posX;
        let cy = cell.posY;

        xStart = cx;
        let xEnd = cx;
        yStart = cy;
        let yEnd = cy;

        if (newComponent.width > 1) {
            xEnd = xStart + newComponent.width - 1;
            if (xEnd >= colCount) {
                xEnd = colCount - 1;
                xStart = xEnd + 1 - newComponent.width;
            }
        }
        if (newComponent.height > 1) {
            yEnd = yStart + newComponent.height - 1;
            // if (yEnd >= rowCount) {
            //     yEnd = rowCount - 1;
            //     yStart = yEnd + 1 - newComponent.height;
            // }
        }
        for (let y = 0; y < rowCount; y++) {
            for (let x = 0; x < colCount; x++) {
                if ((x >= xStart && x <= xEnd) && (y >= yStart && y <= yEnd)) {
                    dropDivRows[y][x].backgroundColor = true;
                } else {
                    dropDivRows[y][x].backgroundColor = false;
                }
            }
        }
        dropDivRows = dropDivRows;
    }

    function drop(ev) {
        let cell: DivInGrid = {posX: xStart, posY: yStart}
        console.log('cell:', cell);
        dispatcher('drop', cell);
    }
</script>

<div class="template_layout"
     style="position: absolute; top:0; left:0; grid-gap: 0px;
{canDrop? ` display: grid; grid-template-columns: repeat(${colCount}, 1fr); grid-template-rows: repeat(${rowCount}, 1fr);` : 'display: none;'}">
    {#each dropDivRows as row}
        {#each row as cell}
            <div on:dragover={dragover} on:drop={drop} on:dragenter="{dragenter(cell)}"
                 style="{cell.backgroundColor ? 'background-color: #dfd;':''} z-index:50;"></div>
        {/each}
    {/each}
</div>

<style>

    .template_layout {
        width: 100%;
        height: 100%;
        display: grid;
        grid-gap: 3px;
        padding: 3px;
    }

</style>