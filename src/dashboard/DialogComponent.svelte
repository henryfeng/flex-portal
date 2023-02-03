<script lang="ts">

    import {onMount} from "svelte";
    import appCtx from "../lib/AppContext";
    import componentManager from "../ComponentManager";
    import type{BoardComponent} from "../ComponentManager";

    export let code: string;
    export let params: any;

    let componentInfo;
    let component;
    let parameters;

    const loadComponent = async () => {
        return await appCtx.getFetcher().get(`/flex-dashboard/service/component/${code}`);
    }

    const showIndicator = () => {

    }

    const hideIndicator = () => {

    }

    const showError = () => {

    }

    const board = {
        showIndicator,
        hideIndicator,
        showError
    }

    onMount(async()=>{
        try {
            componentInfo = await loadComponent();
            let bc:BoardComponent = await componentManager.get(componentInfo.classCode);
            if (bc != null) {
                parameters = JSON.parse(componentInfo.classParameters);
                component = bc.clazz;
            }
        } catch (ex) {

        }
    })

</script>
<div style="width: 100%; height: 100%">
    {#if component}
        <svelte:component this={component} title={componentInfo.title || componentInfo.name}
                          {board}
                          parameters={parameters}
                          script={componentInfo.script}
                          serviceUrl={componentInfo.serviceUrl}/>
    {/if}
</div>