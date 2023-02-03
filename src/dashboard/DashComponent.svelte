<script lang="ts">

    import {onMount} from "svelte";
    import componentManager from "../ComponentManager";

    export let frame;

    let component;
    let frameProps:any={}
    let loaded: boolean = false;
    let script;


    onMount(async()=>{
        try {
            console.log("当前组件框架：", frame);
            frameProps = {
                id: frame.frameId,
                title: frame.title,
                row: frame.posY + 1,
                col: frame.posX + 1,
                colSpan: frame.width,
                rowSpan: frame.height,
                name: frame.name,
                script: frame.script,
            };
            component = await componentManager.get(frame.component.clazz.code);
            console.debug('嵌入的组件：', component);
        } catch (e) {

        } finally {
            loaded = true;
        }
    });

</script>
{#if loaded}
    <svelte:component this={component} frame={frameProps} title={frame.title || frame.name}
                      parameters={frame.component.clazz.parameters}
                      script={frame.component.script}
                      serviceUrl={frame.component.serviceUrl}/>
{/if}
