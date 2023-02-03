<svelte:head>
    <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
    />

</svelte:head>
<script lang="ts">
    import {MessageBoxPanel} from "ticatec-smui-framework";
    import {Indicator, TicatecIndicator, TicatecToast, TicatecFormField} from "ticatec-app-framework";
    import qs from "qs";
    import TemplateLayoutPanel2 from "./template/TemplateLayoutPanel2.svelte";
    import {service} from './template/TemplateManager';

    import {initialize} from "./MainApp";
    import {onMount} from "svelte";
    import type {Template} from "./template/Entities";
    import TeSelect from "./lib/components/TeSelect/index.js";

    let templateId: string;
    let userPath, modCode, userCode;
    //let isUserTemplate:boolean = false;
    let isAdmin: boolean;

    let tmpList: Array<Template>;
    let curTemplate: Template;

    onMount(async () => {
        Indicator.show('加载仪表盘...');
        try {
            await initialize();
            const query: string = window.location.search;
            const params: any = qs.parse(query.substring(1));
            console.log('params:', params);
            if (params.templateId) {
                templateId = params.templateId;
                isAdmin = true;
                inModify = true;
            } else {
                isAdmin = false;
                userPath = params.userPath;
                userCode = getUserCodeFrmUserPath(userPath);
                modCode = params.modCode;
                console.log('userPath , modCode ,userCode:', userPath, modCode, userCode);

                tmpList = await service.loadTemplate(userPath, modCode);
                console.log('tmpList:', tmpList);

                if (tmpList && tmpList.length > 0) {
                    for (let i = 0; i < tmpList.length; i++) {
                        if (tmpList[i].default) {
                            templateId = tmpList[i].id;
                            break;
                        }
                    }
                }
            }

        } finally {
            Indicator.hide();
        }
    })

    async function settings() {
        // 点击小齿轮图标了。如果在1后台管理布局，直接切换编辑模式。如果是在其他应用中，就得考虑是模块下的默认模板还是用户自己定义的模板了。
        // 2其他应用中，用户已自定义过了，则直接切换编辑模式
        // 3其他应用中，用户未自定义，在用模块下的默认模板，则复制默认模板来做为用户自定义模板，并加载新的模板然后进入编辑模式

        if (isAdmin) {

        } else {
            console.log('settings. curTemplate:', curTemplate)
            if (curTemplate.isPrivate) {

            } else {
                let uTmp = await service.cloneUserTemplate(userCode, templateId);
                tmpList.push(uTmp);
                tmpList = tmpList;
                /*
                这里有个问题：使用TeSelect标签来显示模板列表并可修改选中的模块时，修改tmpList会造成它bind:value的templateId变量稍晚时
                被改为undefined,但它还能正常显示，奇怪。它也不好看，我不用它了。
                 */
                templateId = uTmp.id;
                console.log('settings. curTemplate,templateId:', curTemplate, templateId);
            }
        }
    }

    $:if (templateId != null) {
        changeTemplate();
    }
    $:{
        console.log('$$$$$$$$$',templateId)
    }

    function changeTemplate() {
        console.log('changeTemplate. templateId:', templateId);
        for (let i = 0; i < tmpList.length; i++) {
            if (templateId == tmpList[i].id) {
                curTemplate = tmpList[i];
                break;
            }
        }
        console.log('changeTemplate. templateId,curTemplate:', templateId, curTemplate);
        inModify = false;
    }

    let inModify: boolean = false;

    function getUserCodeFrmUserPath(userPath: string) {
        return userPath.split(',')[0];
    }
</script>
<div class="ticatec-dashboard-panel-wrapper" style="overflow: hidden;display: flex;flex-direction: column;">
    <div style="width: 100%;">
        {#if !isAdmin}
            <TicatecFormField label="模板列表：">
                <TeSelect check$style="width: 100%" variant="outlined" bind:value={templateId}
                          opKey="id" opValue="name" menu$style="height: 240px"
                          noLabel={true} list={tmpList}/>
            </TicatecFormField>
        {/if}
    </div>
    <div style="width: 100%;flex-grow: 1;">
        {#if templateId != null}
            <TemplateLayoutPanel2 {templateId} on:settings={settings} {inModify}/>
        {/if}
    </div>
</div>
<TicatecToast/>
<TicatecIndicator/>
<MessageBoxPanel title="Magic Dashboard"/>
