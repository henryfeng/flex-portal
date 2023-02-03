<script lang="ts">

    import iconClose from '../assets/close.svg';
    import {createEventDispatcher, onMount} from "svelte";
    import appCtx from "../lib/AppContext";

    export let style:string = "width: 80%; height: 80%;";
    export let callback = null;
    export let component = null;
    export let props: any;
    export let title: string = '';

    let dispatch = createEventDispatcher();

    const closeDialog = () => {
        dispatch('close');
    }

    onMount(()=>{
        if (props.ticketId) {
            let emitter = appCtx.getEmitter();
            console.log("订阅消息：", props.ticketId);
            emitter.once(props.ticketId, function (data) {
                console.log("收到消息：", data);
                if (callback) {
                    callback(data);
                }
            })
        }
    })

</script>

<div class="tsui-dashboard-dialog" {style}>
    <div class="title-bar">
        <span>{title}</span>
        <img src={iconClose} on:click={closeDialog}/>
    </div>
    <div class="dialog-content">
        {#if component}
            <svelte:component this={component} {...props} />
        {/if}
    </div>
</div>
