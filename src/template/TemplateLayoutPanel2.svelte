<script lang="ts">
    import EditorTopBar from "./EditorTopBar.svelte";
    import ComponentLayoutPanel from "./ComponentLayoutPanel2.svelte";
    import ComponentFrameListBox from "./ComponentFrameListBox2.svelte";
    import type {DivInGrid, Frame, TemplateLayout, Template} from "./Entities";
    import {onMount,createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
    let zoom: number = 1;

    const colCount = 24, rowCount = 20;
    export let templateId:string = null;
    let template: Template = null;
    let componentList: Array<TemplateLayout> = null;
    onMount(async () => {

    });
    $:if(templateId != null){
        loadTemplate();
    }
    async function loadTemplate() {
        window.Indicator.show('查询布局。。。');
        try {
            template = await service.load(templateId);
            componentList = template.components;
            needSave = false;
        } finally {
            window.Indicator.hide();
        }
    }

    // ====拖动添加新控件的功能 start ====
    // 有个小问题：拖动过程中的图标最好不要太大，因为一直取的是鼠标的坐标，不是图标的左上角，添加的位置是按鼠标的坐标计算后入格的。图标大了感觉怪怪的
    let newComponent: TemplateLayout;

    let canDrop: boolean = false;

    //拖动开始 复制拖拽的元素内容
    function dragstart(ev) {
        let frame: Frame = ev.detail;
        newComponent = null;
        newComponent = {
            frameId: frame.id,
            posX: 0,
            posY: 0,
            width: 1,
            height: 1
        };
        // 框的默认宽高的支持：只有默认宽高值能放进模板里面，且大于1时，才会赋值，否则按最小大小显示。
        if (frame.width && frame.width > 1 && frame.width < colCount) {
            newComponent.width = frame.width;
        }
        if (frame.height && frame.height > 1 && frame.height < rowCount) {
            newComponent.height = frame.height;
        }
        canDrop = true;
        console.log('-dragstart.', canDrop)
    }

    //当拖拽到释放区域内后
    function drop(ev) {
        if (newComponent) {
            let xy: DivInGrid = ev.detail;
            newComponent.posX = xy.posX;
            newComponent.posY = xy.posY;
            // 同一个工具在一个模板中只能添加一次
            for (let i = 0; i < componentList.length; i++) {
                if (newComponent.frameId == componentList[i].frameId) {
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
            componentList.push(newComponent);
        }
    }

    // 整个拖动完成后
    function dragend(ev) {
        console.log('dragend')
        // 触发显示内容的改变
        componentList = componentList;
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

    // 上面的显示当前控件的位置和大小的功能
    let curComponent: TemplateLayout;

    function handleChange() {
        componentList = componentList;
        needSave = true;
    }

    function delComonent(item) {
        for (let i = 0; i < componentList.length; i++) {
            if (componentList[i].posX === item.posX && componentList[i].posY === item.posY) {
                console.log('----', i)
                componentList.splice(i, 1);
            }
        }
    }

    function handleDel(ev) {
        let item = ev.detail;
        delComonent(item);
        componentList = componentList;
        needSave = true;
    }

    import {service} from "./TemplateManager";
    async function handleSave(ev) {
        console.log('handleSave.', ev);
        try {
            window.Indicator.show('保存布局...');
            await service.saveLayout(template);
            needSave = false;
        }finally {
            window.Indicator.hide();
            if(needSave){
                window.MessageBox.show('布局保存失败',()=>{});
            }
        }

    }

    let needSave: boolean = false;

    function handleClose(ev) {
        if (needSave) {
            window.MessageBox.show(`布局还未保存，要保存吗？`, async (mr) => {
                if (mr == window.MessageBox.MR_YES) {
                    await handleSave(ev);
                    dispatch('close');
                }else if(mr == 2){
                    // TODO 3键对话框还未实现
                    dispatch('close');
                }
            });
        }else{
            dispatch('close');
        }
    }
    async function handleReset(){
        if (needSave) {
            window.MessageBox.show(`布局还未保存，继续会丢失你的修改，要继续吗？`, async (mr) => {
                if (mr == window.MessageBox.MR_YES) {
                    await loadTemplate();
                }
            });
        }else{
            await loadTemplate();
        }
    }

    export let inModify:boolean = false;
</script>

    <div class="ticatec-template-editor-board-container2">
        <div class="ticatec-template-layout-container-wrapper">
            <EditorTopBar bind:zoom {curComponent} on:close={handleClose} on:change={handleChange}
                          on:save={handleSave} on:reset={handleReset} bind:inModify on:settings/>
            <div class="ticatec-template-layout-container">
                <div class="ticatec-template-editor-panel-wrapper2" style="zoom: {zoom}">
                    <ComponentLayoutPanel {componentList} {rowCount} {colCount} {canDrop} {newComponent} {zoom} {inModify}
                                          bind:curComponent
                                          on:drop={drop} on:dragend={dragend}
                                          on:dragstart={dragstartRight} on:delClick={handleDel}>

                    </ComponentLayoutPanel>
                </div>
            </div>
        </div>
        <ComponentFrameListBox on:dragstart={dragstart} on:dragend={dragend} show="{inModify}"/>
    </div>

<style>
    .ticatec-template-editor-board-container2 {
        width: 100%;
        height: 100%;
        position: relative;
        background-color: #fefefe;
        border: 1px solid #7f7f7f;
    }

    .ticatec-template-editor-panel-wrapper2 {
        position: relative;
        width: 100%;
        height: 110%;
        box-sizing: border-box;
        zoom: 1;
    }
</style>