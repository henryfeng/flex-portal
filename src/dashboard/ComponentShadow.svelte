<script lang="ts">

    import iconConner from '../assets/corner_icon.svg';

    export let left: number = 0;
    export let top: number = 0;
    export let width: number = 0;
    export let height: number = 0;

    let style='';

    $: {
        style = `left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px`;
    }

</script>
<div class="component-frame-shadow-wrapper" style={style}>
    <img class="conner" alt="" src={iconConner} on:mousedown on:mouseup on:drag on:dragend/>
</div>