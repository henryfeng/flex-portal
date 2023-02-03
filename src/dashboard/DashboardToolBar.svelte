<script lang="ts">

    import type {ComponentFrame} from "../lib/Template";
    import {fade} from "svelte/transition";

    export let selectedFrame:ComponentFrame;

    let top: number;
    let left: number;
    let width: number;
    let height: number;

    $: {
        if (selectedFrame == null) {
            top = null;
            left = null;
            width = null;
            height = null;
        } else {
            top = selectedFrame.posY;
            left = selectedFrame.posX;
            width = selectedFrame.width;
            height = selectedFrame.height;
        }
    }

</script>
<div transition:fade class="ticatec-dashboard-editor-toolbar">
    <label>
        <span>X:</span>
        <input type="number" bind:value={left}/>
    </label>
    <label>
        <span>Y:</span>
        <input type="number" bind:value={top}/>
    </label>
    <label>
        <span>宽度:</span>
        <input type="number" bind:value={width}/>
    </label>
    <label>
        <span>高度:</span>
        <input type="number" bind:value={height}/>
    </label>
</div>