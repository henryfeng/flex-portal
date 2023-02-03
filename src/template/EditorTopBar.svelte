<script lang="ts">
    import iconClose from '../assets/close.svg';
    import iconZoomIn from '../assets/zoom_in.svg';
    import iconZoomOut from '../assets/zoom_out.svg';
    import iconSettings from '../assets/settings.svg';
    import iconSave from '../assets/save_icon.svg';
    import iconReset from '../assets/reset.svg';
    import {createEventDispatcher} from "svelte";
    import type {TemplateLayout} from "./Entities";

    export let zoom:number = 1;
    export let curComponent: TemplateLayout;
    const dispatch = createEventDispatcher();

    const zoomIn = () => {
        if (zoom < 2) {
            zoom += 0.25;
        }
    }

    const zoomOut = () => {
        if (zoom > 0.5) {
            zoom -= 0.25;
        }
    }

    // const dispatchFn = (fn) => {  //on:click={dispatchFn('reset')}  不明白为什么这样写，一打开页面就会触发一次
    //     console.log('dispatchFn.', fn)
    //     dispatch(fn);
    // }
    //
    // const dispatchFn2 = (fn) => {
    //     console.log('dispatchFn2.', fn)
    // }

    const save = ()=>{
        dispatch('save');
    }
    const close = ()=>{
        //dispatch('close');
        inModify = false;
    }
    const reset = ()=>{
        dispatch('reset');
    }
    const settings = () => {
        inModify = true;
        dispatch('settings');
    }

    const nullComponent = {
        frameId:'',
        posX:0,
        posY:0,
        width:0,
        height:0
    };
    $:{
        if(curComponent == null){
            curComponent = nullComponent;
        }
    }

    export let inModify:boolean;

</script>
<div class="ticatec-template-editor-top-bar-wrapper" style="height: 32px;">
    <div>{#if inModify}
        <div class="editor-attr-field">
            <label>X:</label>
            <input type="number" bind:value={curComponent.posX} on:change/>
        </div>
        <div class="editor-attr-field">
            <label>Y:</label>
            <input type="number" bind:value={curComponent.posY} on:change/>
        </div>
        <div class="editor-attr-field">
            <label>W:</label>
            <input type="number" bind:value={curComponent.width} on:change/>
        </div>
        <div class="editor-attr-field">
            <label>H:</label>
            <input type="number" bind:value={curComponent.height} on:change/>
        </div>{/if}
    </div>

    <div style="position: absolute; top: 4px; right: 8px">
        {#if inModify}
            <img src={iconReset} alt="" on:click={reset}/>
            <img src={iconSave} alt=""  on:click={save}/>
            <img src={iconClose} alt="" on:click={close}/>
        {:else }
            <img src={iconSettings} alt="修改" on:click={settings}/>
        {/if}
    </div>
</div>