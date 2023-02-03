<script lang="ts">
    import ChartPanel, {TicatecChart, echartUtils} from 'tsui-echarts';

    import {onMount} from "svelte";
    import PortalContext from "../../PortalContext";
    import dataService from "../../lib/DataService";
    import utils from "../../../lib/Utils";
    import {parseEChartsScriptEngine} from "../ScriptEngine"

    export let script: string = '';
    export let serviceUrl: string = '';
    export let title: string = "";
    export let parameters: any = null;
    export let board;
    export let args:any = {}

    let chart: any;
    let chartInst: any;
    let ctx:PortalContext;

    onMount(async () => {
        ctx = new PortalContext(board);
        board.showIndicator('读取数据...');
        try {
            chartInst = parseEChartsScriptEngine(ctx, echartUtils, utils, script)
            chart = new TicatecChart(parameters.option);
            const result = await dataService.getData(serviceUrl, chartInst.getParams(args));
            chartInst.main(chart, result);
            chart.invalidate();
            console.log(chart);
            chart.setClickHandler(chartInst.clickHandler);
        } catch (ex) {
            console.error(ex);
            ctx.board.showError('初始化脚本错误');
        } finally {
            board.hideIndicator();
        }
    })

</script>
{#if chart}
    <ChartPanel style="width: 100%; height: 100%" {chart}/>
{/if}
