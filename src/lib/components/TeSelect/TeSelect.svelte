<script lang="ts">

    import {createEventDispatcher} from 'svelte';
    import {onMount} from 'svelte'
    import Select, {Option} from '@smui/select';

    export let check$style:string = ''
    export let list: Array<any>;
    export let value: string;
    export let label: string = null;
    export let noLabel: boolean = true;
    export let opKey: string = null;
    export let opValue: string = null;
    export let invalid:boolean = false;
    export let disabled:boolean = false;
    export let emptyText: string = null;
    export let emptyKey: string = ' ';
    export let menu$style: string = '';
    export let variant = 'standard';

    let dispatch = createEventDispatcher();

    let lastValue = value;

    $: if (value !== lastValue) {
        const item = list.find(el=>el[opKey] == value);
        dispatch('change', {value, item});
        lastValue = value;
    }


    onMount(async () => {
        lastValue = value;
    });

</script>

{#if list}
<Select {disabled} style={check$style}
        {menu$style} {variant} bind:value={value} label={label} noLabel={noLabel} on:blur}>
    {#if emptyText!=null}
        <Option value={emptyKey}>{emptyText}</Option>
    {/if}
    {#each list as item}
        <Option value={item[opKey]}>{item[opValue]}</Option>
    {/each}
</Select>
{/if}