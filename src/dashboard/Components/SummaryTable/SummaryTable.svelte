<script lang="ts">
    import SummaryTable from "@hanmotec/tsui-summary-table";
    import type {Column} from "@hanmotec/tsui-summary-table";
    import dataService from "../../lib/DataService";
    import iconRefresh from "../../../assets/refresh.svg";

    import {onMount} from "svelte";
    import PortalContext from "../../PortalContext";
    import {parseScriptEngine} from "../ScriptEngine";
    import utils from "../../../lib/Utils";

    export let script: string = '';
    export let serviceUrl: string = '';
    export let title: string = "";
    export let parameters: any = null;
    export let board;
    export let args: any = {};

    let list: [] = [];
    let hasMore: boolean = false;
    let itemEqual: any;
    let params: any;
    let columns: Array<Column> = null;
    let handleChevronClick: any;

    export const handleResult = (data) => {
        console.log('处理返回的数据', data);
    }


    onMount(async () => {
        console.log('board', board)
        board.showIndicator('初始化组件...');
        try {
            const inst:any = parseScriptEngine(new PortalContext(board), utils,  script);
            columns = inst.getColumns();
            params = inst.getParams(args) || {};
            params.page = 1;
            itemEqual = inst.itemEqual || ((o1, o2) => false);
            list = await loadDataFromServer();
        } finally {
            board.hideIndicator();
        }
    })

    const loadDataFromServer = async () => {
        let result:any = await dataService.getData(serviceUrl, params);
        console.log("查询数据结果", result);
        hasMore = result.hasMore == true;
        return result.list;
    }

    export const refresh = async () => {
        board.showIndicator('读取数据...');
        try {
            params.page = 1;
            list = await loadDataFromServer();
        } finally {
            board.hideIndicator();
        }
    }

    const mergeData = (resultList: []): void => {
        resultList.forEach(item => {
            if (!itemEqual(item)) {
                list.push(item);
            }
        })
        list = [...list];
    }

    const loadData = async () => {
        board.showIndicator('读取数据...');
        try {
            params.page++;
            mergeData(await loadDataFromServer());
        } finally {
            board.hideIndicator();
        }
    }


</script>

{#if columns}
    <SummaryTable style="width: 100%; font-size: 12px;padding: 6px; box-sizing: border-box; position: relative;" {columns} {list} {hasMore}
                  table$style="border: 1px solid var(--ticatec-summary-table-header-background-color)"
                  on:chevronClick={handleChevronClick}
                  on:loadMore={loadData}>
        <div slot="title-bar" class="component-title-bar">
            <div><span>{title}</span></div>
            <img on:click={refresh} src={iconRefresh}/>
        </div>
    </SummaryTable>
{/if}

<style>
    .component-title-bar {
        width: 100%;
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        position: relative;
        padding: 4px 8px;
    }

    .component-title-bar div {
        width: 100%;
        line-height: 15px;
        font-size: 1.1em;
        font-weight: 600;
        flex-grow: 1;
        flex-shrink: 1;
    }

    .component-title-bar img {
        width: 18px;
        height: 18px;
        flex-grow: 0;
        flex-shrink: 0;
    }

</style>