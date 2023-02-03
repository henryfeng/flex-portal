<script lang="ts">

    import type {DivInGrid, TemplateLayout} from "./Entities";
    import {createEventDispatcher, onMount} from "svelte";
    import DropIn from "./DropIn2.svelte";
    import icoResize from '../assets/resize.svg';
    import icoMove from '../assets/mv.svg';
    import icoDel from '../assets/white_close.svg';
    import {MessageBox} from "ticatec-app-framework";

    const dispatcher = createEventDispatcher();
    // 模板的布局被分成几行几列
    export let rowCount = 20, colCount = 24;
    // 布局上要显示哪些控件
    export let componentList: Array<TemplateLayout>;
    // 正在添加的新控件
    export let newComponent: TemplateLayout;

    // 是否显示DropIn这个层，显示它时，才能把控件拖上来，才能添加控件到模板
    export let canDrop: boolean = false;

    export let zoom: number = 1;
    let mobanLayout;
    let height = 1000;// 冯哥一开始设计的大小wh是1200*1000，每个小黑点的间距是25，所以单元格的宽高是一样的都是50，计算出一行是24列colCount=24，行数是rowCount = 20。我们按这个来显示点点，两个点点是一个单元格宽高
    onMount(() => {
        initWidthHeight();
    });

    function initWidthHeight(){
        // 我们按照冯哥设计的小黑点，按固定宽高比来显示我们的内容。内容多时，自动增加高度
        let mobanLayoutRect = mobanLayout.getBoundingClientRect();
        console.log('onMount. mobanLayoutRect:', mobanLayoutRect);
        // 整个区域，最小的高
        height = mobanLayoutRect.width * 1000 / 1200;
        mobanLayout.style.height = height + 'px';
        console.log('onMount. height:', height);
        cellHeight = cellWith = mobanLayoutRect.width / colCount * zoom;
        console.log('onMount. cellWith,mobanLayoutRect.width:', cellWith, mobanLayoutRect.width);
    }
    $:if (componentList != null && mobanLayout != null) {
        addHeight();
    }

    function addHeight() {
        // 内容的高超了容器的高后，容器的高要增加
        let needAddHeight = false;
        for (let i = 0; i < componentList.length; i++) {
            if (componentList[i].posY + componentList[i].height > rowCount) {
                rowCount = componentList[i].posY + componentList[i].height;
                needAddHeight = true;
            }
        }
        console.log('addHeight. rowCount:', rowCount);
        if (needAddHeight) {
            height = rowCount * cellHeight;
            mobanLayout.style.height = height + 'px';
        }
    }

    // =======拖动改变大小的功能 start===========
    let cellWith, cellHeight;
    export let curComponent: TemplateLayout;
    // 位置，在down中取值
    let downCurItemColStart, downCurItemRowStart, downEvClientX, downEvClientY, downCurItemColEnd, downCurItemRowEnd;
    // 鼠标按下时的位置，使用n、s、w、e表示 n 顶,  s 底, w 左, e 右。4个角：nw sw ne se
    let direct = ''
    // 是否开启尺寸修改
    let resizeable = false;

    // 改变大小的开始，鼠标按下。
    function mousedown(ev, item: TemplateLayout) {
        document.body.style.cursor = 'se-resize';
        //ev.stopPropagation()
        // 其他的不走了
        ev.preventDefault();
        console.log('mousedown. ', ev, item)
        direct = 'se';

        resizeable = true;
        downEvClientX = ev.clientX;
        downEvClientY = ev.clientY;
        curComponent = item;//getTemplateTool(downCurItemColStart - 1, downCurItemRowStart - 1);
        downCurItemColStart = curComponent.posX + 1;//parseInt(curDivInGrid.style.gridColumnStart);
        downCurItemRowStart = curComponent.posY + 1;//parseInt(curDivInGrid.style.gridRowStart);
        console.log('mousedown. downCurItemColStart,downCurItemRowStart:', downCurItemColStart, downCurItemRowStart)

        downCurItemColEnd = downCurItemColStart + curComponent.width;//parseInt(curDivInGrid.style.gridColumnEnd);
        downCurItemRowEnd = downCurItemRowStart + curComponent.height;//parseInt(curDivInGrid.style.gridRowEnd);

    }

    // 只管修改大小，不管鼠标的图标了
    function mousemove(ev) {
        if (resizeable) {
            let changed = false;
            // 鼠标按下的位置在右边，修改宽度
            if (direct.indexOf('e') !== -1) {
                let distanceX = getDistanceX(ev);
                //console.log('nx:',nx);
                const newColEnd = downCurItemColEnd + distanceX;
                console.log('newColEnd:', newColEnd);
                if (curComponent.width !== newColEnd - downCurItemColStart) {
                    curComponent.width = newColEnd - downCurItemColStart;
                    changed = true;
                }
            }
            // 鼠标按下的位置在底部，修改高度
            if (direct.indexOf('s') !== -1) {
                let distanceY = getDistanceY(ev);
                const newRowEnd = downCurItemRowEnd + distanceY;
                if (curComponent.height !== newRowEnd - downCurItemRowStart) {
                    curComponent.height = newRowEnd - downCurItemRowStart;
                    changed = true;
                }
            }
            if (changed) {
                componentList = componentList;
            }
        }
    }

    // 鼠标松开时结束尺寸修改
    function mouseup() {
        // curTemplateTool = null;
        resizeable = false;
        document.body.style.cursor = 'default';
    }

    function getDistanceX(ev) {
        let eX = ev.clientX - downEvClientX;
        let nx = Math.round(eX / cellWith);
        if (nx + (downCurItemColEnd - downCurItemColStart) < 1) {
            nx = 1 - (downCurItemColEnd - downCurItemColStart);
        }
        console.log('nx:', nx, (downCurItemColEnd - downCurItemColStart))
        return nx;
    }

    function getDistanceY(ev) {
        let eY = ev.clientY - downEvClientY;
        let nY = Math.round(eY / cellHeight);
        if (nY + (downCurItemRowEnd - downCurItemRowStart) < 1) {
            nY = 1 - (downCurItemRowEnd - downCurItemRowStart);
        }
        return nY;
    }

    // =======拖动改变大小的功能 end===========

    // ===== 拖动改变已添加的控件的位置 start ====
    function dragstartRight(item) {
        console.log(item)
        dispatcher('dragstart', item);
    }

    function mousedownDrag(ev) {
        // 只做改变位置的drag，不做改变大小的操作。
        ev.stopPropagation()
    }

    // ===== 拖动改变已添加的控件的位置 end ====

    function componentClick(item) {
        if(inModify){
            curComponent = item;
        }
    }

    const confirmClose = (item) => {
        MessageBox.show('确定要删除这个组件吗?', (mrResult) => {
            if (mrResult) {
                dispatcher('delClick', item);
            }
        });
    }

    export let inModify:boolean = false;
    $:if(inModify === false){
        curComponent = null;
    }

</script>
<div bind:this={mobanLayout} style="width: 100%;height: 100%;position: relative;">
    <div class="ticatec-template-editor-panel2 template_layout" on:mousemove={mousemove} on:mouseup={mouseup}
         style="grid-template-columns: repeat( {colCount}, 1fr); grid-template-rows: repeat({rowCount}, 1fr);
            {inModify?`background-image: radial-gradient(circle at ${cellWith}px ${cellWith}px, black 1px, transparent 0);background-size: ${cellWith}px ${cellWith}px;`:''}">
        {#if componentList}
            {#each componentList as item}
                <div class="tool_right"
                     style="{item == curComponent?'background-color: #ccddcc;':''} grid-column-start: {item.posX +1};grid-column-end:{item.posX+1+item.width};
                            grid-row-start: {item.posY +1}; grid-row-end:{item.posY +1+item.height}; "
                     on:click={componentClick(item)}>
                    <slot name="tool_right" tool="{item}">{item.frameId}</slot>
                    {#if item == curComponent}
                        <div class="ico_resize" on:mousedown={mousedown(event,item)}>
                            <img src="{icoResize}" class="ico_resize_img"/>
                        </div>
                        <div class="ico_move" draggable="true" on:dragend
                             on:dragstart={dragstartRight(item)} on:mousedown={mousedownDrag}>
                            <img src="{icoMove}" class="ico_resize_img"/>
                        </div>
                        <div class="ico_del" on:click={confirmClose(item)}>
                            <img src="{icoDel}" class="ico_resize_img"/>
                        </div>
                    {/if}
                </div>
            {/each}
        {/if}
    </div>
    {#if inModify}
    <DropIn {rowCount} {colCount} {canDrop} {newComponent} on:drop/>
    {/if}
</div>

<style>
    .ticatec-template-editor-panel2 {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background-color: #FFFFFF;
        border: 1px solid #cccccc;

    }

    .template_layout {
        display: grid;
        grid-gap: 3px;
        padding: 0px;
    }

    div {
        box-sizing: border-box;
    }

    .ico_resize_img {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .ico_resize {
        width: 20px;
        height: 20px;
        position: absolute;
        bottom: 0px;
        right: 0px;
        border: none;
        cursor: se-resize;
        opacity: 1;
        border-radius: 50%;
        background-color: #339933;
    }


    .ico_move {
        width: 20px;
        height: 20px;
        position: absolute;
        left: 0px;
        top: 0px;
        border: none;
        cursor: move;
        opacity: 1;
        border-radius: 50%;
        background-color: #339933;
    }

    .ico_del {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 0px;
        top: 0px;
        border: none;
        cursor: pointer;
        opacity: 1;
        border-radius: 50%;
        background-color: #ff3e00;
    }

    .tool_right {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border: 1px solid #000;
        box-sizing: border-box;
        position: relative;
    }

    .tool_right:hover {
        border: 1px solid #390;
    }

</style>