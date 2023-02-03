<script lang="ts">
    import {MessageBoxPanel} from "ticatec-smui-framework";
    import {Indicator, TicatecIndicator, TicatecToast} from "ticatec-app-framework";
    import qs from "qs";
    import Dashboard from "./dashboard/Dashboard.svelte";
    import TemplateManager from "./lib/TemplateManager";
    import SplashScreen from "./SplashScreen.svelte";

    import {initialize} from "./MainApp";
    import {onMount} from "svelte";
    import {DashboardStatus} from "./lib/DashboardStatus";
    import componentManager from "./ComponentManager";
    import appCtx from "./lib/AppContext";

    let loadStatus: 'loading' | 'loaded' | 'error' = 'loading';
    let status:DashboardStatus = DashboardStatus.Browser;
    let templateMgr: TemplateManager;
    let template;

    onMount(async ()=>{
        try {
            let emitter = appCtx.getEmitter();
            window.onmessage = (event) => {
                console.debug('从iframe获取的消息', event.data);
                let msg = event.data || {}
                emitter.emit(msg.ticketId, msg.data);
            }
            let start = (new Date()).getTime();
            await initialize();
            const query: string = window.location.search;
            const params: any = qs.parse(query.substring(1));
            console.debug('系统参数', params);
            await componentManager.initialize();
            if (params.templateId != null) {
                console.debug('进入到对指定的模版进行编辑的状态');
            } else {
                console.debug('初始化模块的相关模版')
                templateMgr = TemplateManager.initialize('qms_index')
                await templateMgr.load();
                template = templateMgr.current;
            }
            if (params.createNew == 'true') {
                //新建一个模版
            } else if (params.module != null) {
                //根据模块加载模版
            }
            console.log(params);
            setTimeout(()=>{
                loadStatus = 'loaded';
            }, (new Date()).getTime() - start + 1000);
        } catch (e) {
            console.error('加载发生错误', e);
            loadStatus = 'error';
        }
    })

</script>
<div class="tsui-dashboard-wrapper">
{#if loadStatus==='loaded'}
    {#if template != null}
        <Dashboard {template} frames={template.frames}  {status}/>
    {:else}

    {/if}
{:else if loadStatus==='loading'}
    <SplashScreen/>
{:else}
{/if}
</div>
<TicatecToast/>
<TicatecIndicator/>
<MessageBoxPanel title="Magic Dashboard"/>
