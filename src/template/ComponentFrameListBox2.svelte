<script lang="ts">

    import {onMount, createEventDispatcher} from "svelte";
    import iconLoading from "../assets/loading.gif";
    import iconSearch from "../assets/search.svg";

    import FrameDataManager from './FrameDataManager'

    const frameMgr = new FrameDataManager();

    export let category:string = '';

    let frameList:Array<any> = [{},{},{}, {}, {}];
    let dispatch = createEventDispatcher();
    let hasMore:boolean = true;
    let isBusy: boolean = false;

    let divToolBarTitle, heightTitle:number;

    const frameCriteria = frameMgr.criteria;
    let pageNo = 1,pageCount;
    onMount(async()=>{
        // 默认加载组件框列表 start
        if(category){
            frameCriteria.componentCategory = category;
        }
        isBusy = true;
        await frameMgr.searchData(frameCriteria, pageNo);
        showFrameList();
        // 默认加载组件框列表 end

        heightTitle = divToolBarTitle.getBoundingClientRect().height;
        if(heightTitle <=0){
            heightTitle = 44;
        }
    })

    // 分页搜索组件框的功能 start
    const loadMoreFrame = async () => {
        if (isBusy == false) {
            console.debug('读取更多数据...');
            isBusy = true;
            if(hasMore){
                pageNo++;
                await frameMgr.setPageNo(pageNo);
                frameList = frameList.concat(frameMgr.list);
                showFrameList2();
            }

        }
    }

    const searchFrame = async ()=> {
        console.log('searchFrame. category:',category)
        if (isBusy == false) {
            isBusy = true;
            pageNo = 1;
            frameCriteria.componentCategory = category;
            await frameMgr.searchData(frameCriteria, pageNo);
            showFrameList();
        }
    }

    const showFrameList = () => {
        frameList = frameMgr.list;
        showFrameList2();
    }

    const showFrameList2 = () => {
        //frameList = frameMgr.list;
        pageCount = frameMgr.pageCount;
        pageNo = frameMgr.pageNo;
        console.log('showFrameList. pageCount,pageNo:',pageCount,pageNo);
        hasMore = pageCount > pageNo;
        isBusy = false
    }
    // 分页搜索组件框的功能 end

    const dragstart = (item) => {
        dispatch("dragstart", item);
        console.debug("dragstart", item);
    }

    // 拖着走
    let moving = false;
    let top:number=40,left:number=10;
    let dx:number,dy:number,dtop:number,dleft:number;
    function mousedown(e){
        //console.log('mousedown',top,left);
        dx = e.clientX;
        dy = e.clientY;
        dtop = top;
        dleft = left;
        //console.log('mousedown', dx,dy,dtop,dleft)
        moving = true;
    }
    function mousemove(e){
        if(moving){
            let xd = e.clientX - dx;
            let yd = e.clientY - dy;
            top = dtop + yd;
            left = dleft + xd;
            //console.log('mousemove', xd, yd, top,left)
        }
    }
    function mouseup(e) {
        moving = false;
    }
    // 展开or折叠，折叠后会变小
    let fold = false;
    function dblclick(){
        fold = !fold;
    }
    export let show = true;

</script>

<div class="ticatec-template-component-listbox-wrapper2" style="top: {top}px;left: {left}px; height:{fold?heightTitle:800}px; {show?'':'display:none;'}">
    <div bind:this={divToolBarTitle} class="toolbar-title" on:mousedown="{mousedown}" on:mousemove={mousemove} on:mouseup={mouseup} on:dblclick={dblclick} >
        工具栏
    </div>
    <div class="search-box" style="border-bottom: 1px solid #E0E0E0">
        <input bind:value={category}/>
        <div class="icon_button">
            <img on:click={searchFrame} style="width: 24px; height: 24px" src={iconSearch}/>
        </div>
    </div>
    <div class="ticatec-listview-box ticatec-layout-flex-auto-fill">
        {#each frameList as item}
            <div class="ticatec-listview-box-item" draggable="true" on:dragstart={dragstart(item)} on:dragend>
                {item.name}
            </div>
        {/each}
        {#if hasMore}
            <div style="width: 100%; padding: 6px 12px; box-sizing: border-box">
                <div style="width: 100%; text-align: center; box-sizing: border-box">
                    <span style="font-style: italic; cursor: pointer; color: #555555" on:click={()=>loadMoreFrame()}>读取更多数据</span>
                </div>
            </div>
        {/if}
    </div>
    <div class="ticatec-board-mask ticatec-flex-layout vertical" style="justify-content: center; background-color: #cccccc10; {isBusy ? '' : 'display: none'}">
        <div class="loading-indicator">
            <div><img style="width: 48px; height: 48px" src={iconLoading}/></div>
            <div style="margin-top: 12px; color: #555555"><span>读取数据...</span></div>
        </div>
    </div>
</div>

<style>
    .search-box {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        position: relative;
    }

    .search-box input {
        width: 100%;
        box-sizing: border-box;
        padding: 6px 8px;
        border-radius: 8px;
        border: 1px solid #7f7f7f;
    }

    .search-box .icon_button {
        position: absolute;
        right: 12px;
        top: 11px;
    }

    .icon_button:active {
        top: 12px;
    }

    .loading-indicator {
        width: 80%;
        min-height: 80px;
        border: 1px solid #e1e1e1;
        background-color: #f7f7f7;
        border-radius: 8px;
        align-self: center;
        text-align: center;
        padding: 8px;
    }

    .ticatec-template-component-listbox-wrapper2 {
        width: 300px;

        position: absolute;
        border: 1px solid #000;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        background-color: #fff;
        overflow: hidden;
    }
    .toolbar-title {
        background-color: #ccf;
        text-align: center;
        font-size: 24px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
</style>