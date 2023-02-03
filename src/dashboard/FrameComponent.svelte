<script lang="ts">

    import {createEventDispatcher, onMount} from "svelte";
    import componentManager from "../ComponentManager";
    import icoDel from "../assets/white_close.svg";
    import icoResize from '../assets/resize.svg';
    import icoMove from '../assets/mv.svg';

    export let frame;
    export let active;
    export let row: number;
    export let col: number;
    export let rowSpan: number;
    export let colSpan: number;
    export let editing: boolean = false;


    let parameters: any;

    const dispatch = createEventDispatcher();

    let component;
    let script;

    const confirmClose = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        dispatch('delete');
    }

    let left: number = 0;
    let top: number = 0;
    let width: number = 0;
    let height: number = 0
    let el;
    let busy:boolean = true;
    let errMsg: string = null;

    $: {
        if (el != null && width>0 && height>0) {
            left = el.offsetLeft+1;
            top = el.offsetTop+1;
        }
    }

    const showIndicator = (msg: string):void => {
        busy = true;
    }

    const hideIndicator = ():void => {
        busy = false;
    }

    const showError = (err: string):void => {

    }

    const openFrameDialog = (url: string, style: string = 'width: 80%; height: 80%') => {
        dispatch('openDialog', {type: 'frame', props: {url, style}, callback: (data) => {
            console.debug('收到iframe来的数据：', data, cmp);
            if (cmp.handleResult) {
                cmp.handleResult(data);
            }
        }});
    }

    const openComponentDialog = (code: string, title: string, params: any, style: string = 'width: 80%; height: 80%') => {
        dispatch('openDialog', {type: 'component', props: {params, title, code, style}});
    }

    let board = {
        showIndicator,
        hideIndicator,
        showError,
        openFrameDialog,
        openComponentDialog
    }

    let cmp;

    onMount(async()=>{
        console.log("当前组件框架：", frame, editing);
    });

    $:if(frame && frame.component && frame.component.clazz && frame.component.clazz.code){
        getComponent();
    }
    const getComponent = async() => {
        try {
            const bc = await componentManager.get(frame.component.clazz.code);
            if(bc){
                parameters = bc.parameters == null ? null : JSON.parse(bc.parameters);
                component = bc.clazz;
            }
        } catch (e) {
            console.error(e);
        } finally {

        }
    }

    // ===== 拖动改变已添加的控件的位置 start ====
    // 原理：从列表中去掉它，然后启动拖动添加控件的代码，最后再添加进来
    function dragstartRight(item) {
        console.log(item)
        dispatch('dragstart', item);
    }

    function mousedownDrag(ev) {
        // 只做改变位置的drag，不做改变大小的操作。
        ev.stopPropagation()
    }
    // ===== 拖动改变已添加的控件的位置 end ====
</script>

<div bind:this={el} class="tsui-component-frame" style="grid-area: {row}/{col}/{row+rowSpan}/{col+colSpan}; position: relative; overflow:hidden;"
     bind:clientWidth={width} bind:clientHeight={height} >
    <div class="component-content" class:blur={busy} style="height: 100%" >
        {#if component!=null}
            <svelte:component this={component} bind:this={cmp} title={frame.title || frame.name}
                              {board}
                              parameters={parameters}
                              script={frame.component.script}
                              serviceUrl={frame.component.serviceUrl}/>
        {/if}
    </div>
    <div class="mask-layer" style="{busy? '' : 'display: none'}">
        <div><span>读取数据中...</span></div>
    </div>
    {#if editing}
    <div class="edit_div" on:click>
        {#if active}
        <div class="ico_resize" on:mousedown>
            <img src="{icoResize}" class="ico_resize_img"/>
        </div>
        <div class="ico_move" draggable="true" on:dragend
             on:dragstart={dragstartRight(frame)} on:mousedown={mousedownDrag}>
            <img src="{icoMove}" class="ico_resize_img"/>
        </div>
        <div class="ico_del" on:click={confirmClose}>
            <img src="{icoDel}" class="ico_resize_img"/>
        </div>
        {/if}
    </div>
    {/if}
</div>

<style>
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

    .edit_div {
        width: 100%;
        height: 100%;
        overflow: hidden;
        /*border: 1px solid #000;*/
        box-sizing: border-box;
        position: absolute;
        top:0px;
        left: 0px;
    }

    .edit_div:hover {
        border: 1px solid #390;
    }
</style>