<script lang="ts">

    import DashboardToolBar from "./DashboardToolBar.svelte";
    import FrameComponent from "./FrameComponent.svelte";
    import ComponentToolWin from "./ComponentToolWin.svelte";
    import type Template from "../lib/Template";
    import type {ComponentFrame, Frame} from "../lib/Template";
    import {DashboardStatus} from "../lib/DashboardStatus";
    import iconSave from "../assets/save_icon.svg";
    import iconRefresh from "../assets/refresh.svg";
    import iconSettings from "../assets/settings.svg";
    import iconModify from "../assets/modify.svg";
    import iconClose from "../assets/close.svg";
    import DashboardDialog from "./DashboardDialog.svelte";
    import {fade} from "svelte/transition";
    import DialogFrame from "./DialogFrame.svelte";
    import DialogComponent from "./DialogComponent.svelte";
    import type {DivInGrid, TemplateLayout} from "../template/Entities";
    import type{Frame as DBFrame }from "../template/Entities";
    import DropIn from "./DropIn2.svelte";
    import {onMount} from "svelte";
    import {service, service as tmpService} from "../template/TemplateManager";

    export let template: Template;
    export let frames: Array<Frame> = [];
    export let status: DashboardStatus;

    const colCount = 24;
    let rowCount:number = 20;

    let dialogVisible: boolean = false;
    let dialogAttrs: any = {};
    let selectedFrame: ComponentFrame;
    let gridStyle:string = '';

    // 初始化大小，最小高度比屏幕要大一些
    let mobanLayout;
    //let height:number = 1200;
    let cellWith:number,cellHeight:number;
    onMount(() => {
        initWidthHeight();
    });

    /**
     * 初始化模板的宽高，不管是使用还是编辑状态的
     */
    function initWidthHeight(){
        // 我原来的想法：模板的大小按固定宽高比来显示。内容超过时，自动增加高度。所以模板的高因为固定宽高比，当有宽度后就有个初始值，以后不够了再增加。
        // 缺点是这个初始高不知道定多少合适，没有把编辑状态和其他状态区分开
        // 冯哥对于当界面的高的设想：由其中的控件来决定，下边缘最靠下的控件的下边缘就是模板整个的下边缘，以这个来决定模板的高。
        // 并且，不设界面的初始高，这个高，直接用样式控制的控件的高来撑大。
        // 然而，我为了定位控件拖进来后它的位置，是在界面上显示满了空白的小DIV，拖到哪个DIV内控件的位置就由那个DIV来决定。而且显示拖进来的控件将要显示的位置和大小时，也是用的这样的多个空白DIV显示的。
        // 所以，我需要提前把dropin控件中的小div都显示出来。那么，我就得时刻知道模板总共有多少行也就是多高。
        // 这个方法的作用： 根据宽，算出单元格的宽和高。都是根据grid的样式来算的。宽是24份平分，高的宽的4.1666%跟50取最大。去掉了原来根据模板宽计算模板高的代码
        // 目前实现的效果：显示时，按已有控件来显示高。编辑时，不拖动高不变，一拖动就出滚动条内容高就变为最小20行，控件需要行数大于20行时，由控件决定行数。
        let mobanLayoutRect = mobanLayout.getBoundingClientRect();
        console.log('onMount. mobanLayoutRect:', mobanLayoutRect);
        // 整个区域，最小的高
        //height = mobanLayoutRect.width * 5 / 6;
        //mobanLayout.style.height = height + 'px';
        //console.log('onMount. height:', height);
        cellWith = mobanLayoutRect.width / colCount ;
        //cellHeight = height / rowCount;
        cellHeight = mobanLayoutRect.width * 4.1666 /100;
        if(50 > cellHeight){
            cellHeight = 50;
        }
        console.log('onMount. cellWith,mobanLayoutRect.width:', cellWith, mobanLayoutRect.width);
    }

    $:if (frames != null && mobanLayout != null) {
        addHeight();
    }

    /**
     * 根据已有的控件，来计算总共有多少行。默认20行。
     */
    function addHeight() {
        rowCount = 20;// 超过20行的部分，不需要就会被删掉
        // 内容的高超了容器的高后，容器的高要增加
        let needAddHeight = false;
        for (let i = 0; i < frames.length; i++) {
            if (frames[i].posY + frames[i].height > rowCount) {
                rowCount = frames[i].posY + frames[i].height;
                needAddHeight = true;
            }
        }
        console.log('addHeight. rowCount:', rowCount);
        // if (needAddHeight) {
        //     height = rowCount * cellHeight;
        //     mobanLayout.style.height = height + 'px';
        // }
    }

    const removeFrame = () => {
        console.log('removeFrame. id:', selectedFrame.frameId)
        delComonent(selectedFrame);
        selectedFrame = null;
        frames = frames;
    }

    const handleFrameClick = (frame) => {
        console.log('handleFrameClick. id:', frame.frameId)
        if (status != DashboardStatus.Browser) {
            selectedFrame = frame;
        }else{
            console.log('handleFrameClick. show show')
        }
    }

    const modifyDashboard = () => {
        status = DashboardStatus.Modify;
        gridStyle = 'grid-auto-rows:unset; grid-template-rows: repeat(20, max(4.1666vw, 50px));';
    }

    const handleSaveClick = async () => {
        // 检查组件间是不是有遮挡
        if(positionErr()){
            window.MessageBox.show('组件之间有遮挡，请调整后再保存',()=>{});
        } else {
            window.Indicator.show('保存布局...');
            try {
                selectedFrame = null;
                await tmpService.saveLayout2(template.id, frames);
                status = DashboardStatus.Browser;
                gridStyle = '';
            } catch (ex) {
                window.MessageBox.show('布局保存失败',()=>{});
            }finally {
                window.Indicator.hide();
            }
        }
        // save to server

    }

    function positionErr():boolean{
        // 检查组件间是不是有遮挡
        for(let i=0;i<frames.length-1;i++){
            for(let x=i+1;x<frames.length;x++){
                // i在x的左边，且i的右边缘在x左边缘的右边，水平方向上冲突
                let leftErr = frames[i].posX < frames[x].posX && frames[i].width+frames[i].posX > frames[x].posX;
                // i在x的右边，且i的右边缘在x右边缘的左边，水平方向上冲突
                let rightErr = frames[i].posX > frames[x].posX && frames[i].posX < frames[x].posX + frames[x].width;
                if(leftErr || rightErr){
                    let topErr = frames[i].posY < frames[x].posY && frames[i].posY + frames[i].height > frames[x].posY;
                    let bottonErr = frames[i].posY > frames[x].posY && frames[i].posY < frames[x].posY + frames[x].height;
                    if(topErr || bottonErr){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const openDialog = (e) => {
        let args: any = e.detail;
        dialogAttrs = {};
        dialogAttrs.props = args.props || {};
        dialogAttrs.title = dialogAttrs.title || '新窗体';
        if (args.type == 'frame') {
            dialogAttrs.props.ticketId = (new Date()).getTime().toString(36).concat((Math.round(Math.random()*100000000)).toString(36));
            dialogAttrs.callback = (data) => {
                if (args.callback) {
                    args.callback(data);
                }
            }

            dialogAttrs.component = DialogFrame;
        } else if (args.type == 'component') {
            dialogAttrs.component = DialogComponent
        }
        dialogVisible = true;
    }


    // ====拖动添加新控件的功能 start ====

    let needSave: boolean = false;
    // 有个小问题：拖动过程中的图标最好不要太大，因为一直取的是鼠标的坐标，不是图标的左上角，添加的位置是按鼠标的坐标计算后入格的。图标大了感觉怪怪的
    let newComponent: Frame;//TemplateLayout;

    let canDrop: boolean = false;

    //拖动开始 复制拖拽的元素内容
    function dragstart(ev) {
        let dbFrame: DBFrame = ev.detail;//let frame: Frame = ev.detail;
        newComponent = null;
        newComponent = dbframe2layout(dbFrame);
        canDrop = true;
    }

    /**
     * 从数据库取出的组件框frame转化为在页面上显示的模板的布局项。
     * @param dbFrame
     */
    function dbframe2layout(dbFrame: DBFrame): ComponentFrame{
        // 布局用到的属性
        let layout:ComponentFrame = {
            frameId: dbFrame.id,
            posX: 0,
            posY: 0,
            width: 1,
            height: 1,
            component:null
        };
        // 框的默认宽高的支持：只有默认宽高值能放进模板里面，且大于1时，才会赋值，否则按最小大小显示。
        if (dbFrame.width && dbFrame.width > 1 && dbFrame.width < colCount) {
            layout.width = dbFrame.width;
        }
        if (dbFrame.height && dbFrame.height > 1 && dbFrame.height < rowCount) {
            layout.height = dbFrame.height;
        }
        // TODO 显示这个组件用到的属性
        // TODO 根据lib/TemplateManager.ts中的代码和OwnerTemplateController.ts接口，补充了查询组件框的接口属性后写的，
        // TODO 有问题，因为依据的东西有问题，接口返回的属性跟前端代码用到的属性对不上，等冯哥提交代码后再改吧。
        layout.script = dbFrame.script;
        layout.params = null;
        layout.component = {
            serviceUrl:dbFrame.serviceUrl,
            script:dbFrame.componentScript,
            clazz:{
                code:dbFrame.classCode,
                parameters:dbFrame.classParameters
            }
        }

        // 另外一些没什么用的属性
        layout.name = dbFrame.name;
        return layout;
    }

    //当拖拽到释放区域内后
    function drop(ev) {
        if (newComponent) {
            let xy: DivInGrid = ev.detail;
            newComponent.posX = xy.posX;
            newComponent.posY = xy.posY;
            // 同一个工具在一个模板中只能添加一次
            for (let i = 0; i < frames.length; i++) {
                if (newComponent.frameId == frames[i].frameId) {
                    window.MessageBox.show('一个框架只能用一次',()=>{});
                    return;
                }
            }
            console.log('+++')
            if (newComponent.width + newComponent.posX > colCount) {
                newComponent.posX = colCount - newComponent.width;
            }
            // if (newComponent.height + newComponent.posY > rowCount) {
            //     newComponent.posY = rowCount - newComponent.height;
            // }

            frames.push(newComponent);
        }
    }

    // 整个拖动完成后
    function dragend(ev) {
        console.log('dragend.', frames.length)
        // 触发显示内容的改变
        frames = frames;
        needSave = true;
        newComponent = null;
        canDrop = false;
    }

    // ====拖动添加新控件的功能 end ====

    // ==== 拖动改变右边控件位置的处理，只有dragstart，因为后面的走的是拖动添加新控件的功能 start =====
    function dragstartRight(ev) {
        let item = ev.detail;
        console.log('dragstartRight', item);
        delComonent(item);
        newComponent = item;
        // TODO 得等它完成dragstart的事情后，那个div再挡上，要不然就不能拖了。其实这段我也不懂。。。。。
        setTimeout(() => {
            canDrop = true;
            console.log('-dragstartRight.', canDrop)
        }, 100)
    }

    // ==== 拖动改变右边控件位置的处理，只有dragstart，因为后面的走的是拖动添加新控件的功能 end =====
    function delComonent(item) {
        console.log('delComonent. x ,y :', item.posX,item.posY);
        for (let i = 0; i < frames.length; i++) {
            if (frames[i].posX === item.posX && frames[i].posY === item.posY) {
                console.log('----', i, frames[i].posX, frames[i].posY, frames[i].frameId)
                frames.splice(i, 1);
            }
        }
    }

    // =======拖动改变大小的功能 start===========
    // 位置，在down中取值
    let downCurItemColStart, downCurItemRowStart, downEvClientX, downEvClientY, downCurItemColEnd, downCurItemRowEnd;
    // 鼠标按下时的位置，使用n、s、w、e表示 n 顶,  s 底, w 左, e 右。4个角：nw sw ne se
    let direct = ''
    // 是否开启尺寸修改
    let resizeable = false;

    // 改变大小的开始，鼠标按下。
    function resizeStart(ev) {
        document.body.style.cursor = 'se-resize';
        //let item = ev.detail;
        //console.log('resizeStart. ', ev, item)
        direct = 'se';
        // 其他的不走了
        ev.preventDefault();

        resizeable = true;
        downEvClientX = ev.clientX;
        downEvClientY = ev.clientY;
        //selectedFrame = item;//getTemplateTool(downCurItemColStart - 1, downCurItemRowStart - 1);
        downCurItemColStart = selectedFrame.posX + 1;//parseInt(curDivInGrid.style.gridColumnStart);
        downCurItemRowStart = selectedFrame.posY + 1;//parseInt(curDivInGrid.style.gridRowStart);
        console.log('mousedown. downCurItemColStart,downCurItemRowStart:', downCurItemColStart, downCurItemRowStart)

        downCurItemColEnd = downCurItemColStart + selectedFrame.width;//parseInt(curDivInGrid.style.gridColumnEnd);
        downCurItemRowEnd = downCurItemRowStart + selectedFrame.height;//parseInt(curDivInGrid.style.gridRowEnd);

    }

    // 只管修改大小，不管鼠标的图标了
    function resizing(ev) {
        //console.log('resizing.');
        if (resizeable) {
            let changed = false;
            // 鼠标按下的位置在右边，修改宽度
            if (direct.indexOf('e') !== -1) {
                let distanceX = getDistanceX(ev);
                //console.log('nx:',nx);
                const newColEnd = downCurItemColEnd + distanceX;
                //console.log('newColEnd:', newColEnd);
                if (selectedFrame.width !== newColEnd - downCurItemColStart) {
                    selectedFrame.width = newColEnd - downCurItemColStart;
                    changed = true;
                }
            }
            // 鼠标按下的位置在底部，修改高度
            if (direct.indexOf('s') !== -1) {
                let distanceY = getDistanceY(ev);
                //console.log('resizing. distanceY:',distanceY);
                const newRowEnd = downCurItemRowEnd + distanceY;
                if (selectedFrame.height !== newRowEnd - downCurItemRowStart) {
                    selectedFrame.height = newRowEnd - downCurItemRowStart;
                    changed = true;
                }
            }
            if (changed) {
                console.log('resizing:',selectedFrame.height);
                frames = frames;
            }
        }
    }

    // 鼠标松开时结束尺寸修改
    function resizeEnd() {
        // curTemplateTool = null;
        resizeable = false;
        document.body.style.cursor = 'default';
    }

    function getDistanceX(ev) {
        //console.log('vvvvvvv:',downEvClientX)
        let eX = ev.clientX - downEvClientX;
        //console.log('vvvvvvv:',eX, cellWith,downCurItemColEnd , downCurItemColStart,)
        let nx = Math.round(eX / cellWith);
        if (nx + (downCurItemColEnd - downCurItemColStart) < 1) {
            nx = 1 - (downCurItemColEnd - downCurItemColStart);
        }
        //console.log('nx:', nx, (downCurItemColEnd - downCurItemColStart))
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


</script>
<div class="tsui-dashboard-panel" style="{dialogVisible ? 'filter: blur(1px)' : ''}">
    <div class="title-bar">
        <div class="title-text">
            <span>{template.title || template.name}</span>
        </div>
        {#if status!==DashboardStatus.Browser}
            <DashboardToolBar {selectedFrame}/>
        {/if}
        <div class="title-toolbar" style="min-width: 180px;">
            {#if status!==DashboardStatus.Browser}
                <div transition:fade class="icon-button">
                    <img alt="" src={iconSave} on:click={handleSaveClick}/>
                </div>
                <div transition:fade class="icon-button">
                    <img alt="" src={iconClose} on:click={handleSaveClick}/>
                </div>
            {:else }
                    <!-- 自己的模版可以编辑 -->
                <div transition:fade class="icon-button">
                    <img alt="" src={iconModify} on:click={modifyDashboard}/>
                </div>
                <!---->
                <div transition:fade class="icon-button">
                    <img alt="" src={iconRefresh}/>
                </div>
                <div transition:fade class="icon-button">
                    <img alt="" src={iconSettings}/>
                </div>
            {/if}
        </div>
    </div>

    <div bind:this={mobanLayout} class="tsui-dashboard" style="width: 100%;height: 100%;position: relative;" on:mousemove={resizing} on:mouseup={resizeEnd}>
        <div class="{status!==DashboardStatus.Browser ? 'show-grid':''}" style="width: 100%;height: 100%;">
            {#each frames as frame}
                <FrameComponent frame={frame} active={frame===selectedFrame}
                                row = {frame.posY + 1}
                                col = {frame.posX + 1}
                                rowSpan = {frame.height}
                                colSpan = {frame.width}
                                editing={status!==DashboardStatus.Browser}
                                on:openDialog={(e)=>openDialog(e, frame)}
                                on:click={()=>{handleFrameClick(frame)}}
                                on:delete={removeFrame}
                                on:mousedown={resizeStart} on:dragstart={dragstartRight}
                                on:dragend={dragend}/>
            {/each}
        </div>
        <DropIn {rowCount} {colCount} {canDrop} {newComponent} on:drop={drop}/>
    </div>

    {#if status!==DashboardStatus.Browser}
        <ComponentToolWin on:dragstart={dragstart} on:dragend={dragend} />
    {/if}
</div>
{#if dialogVisible}
<div class="tsui-dashboard-mask" transition:fade>
    <DashboardDialog on:close={()=>{dialogVisible = false}} {...dialogAttrs}/>
</div>
{/if}
