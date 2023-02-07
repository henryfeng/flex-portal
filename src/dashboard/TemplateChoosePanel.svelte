<script lang="ts">
    import {fly} from "svelte/transition";
    import iconDelete from "../assets/icon_delete.svg"
    import {createEventDispatcher} from "svelte";

    export let templates:[];
    export let current:any;

    const dispatch = createEventDispatcher();

    const deleteTemplate = (e, template) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch('delete', template);
    }

    const selectTemplate = (e, template) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch('change', template);
    }

</script>
    <div class="template-list-panel" transition:fly>
        <div><span>当前可用模版</span></div>
        {#each templates as template}
            {#if template != current}
                <div class="template-item">
                    <div on:click={e=>selectTemplate(e, template)}>
                        <span>{template.name}</span>
                    </div>
                    {#if template.isPrivate}
                        <img src={iconDelete} on:click={(e)=>{deleteTemplate(e, template)}}/>
                    {/if}
                </div>
            {/if}
        {/each}
    </div>

<style>
    .template-list-panel {
        position: fixed;
        top: 0;
        right: 0;
        background-color: #fafafa;
        width: 400px;
        height: 100%;
        padding: 8px 0;
        box-sizing: border-box;
        font-size: 16px;
    }

    .template-item {
        position: relative;
        width: 100%;
        padding: 8px 12px;
        line-height: 24px;
        box-sizing: border-box;
    }

    .template-item img {
        position: absolute;
        width: 18px;
        height: 18px;
        right: 8px;
        top: 4px;
        display: none;
    }

    .template-item img:hover {
        border-radius: 50%;
        background-color: #9d9d9d;
    }

    .template-item img:active {
        top: 5px;
    }

    .template-item div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .template-item:hover {
        background-color: #f0f0f0;
    }

    .template-item:hover img {
        display: block;
    }
</style>