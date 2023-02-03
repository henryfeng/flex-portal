<script lang="ts">
    export let url: string = '';
    export let ticketId: string = '';
    export let callback = null;

</script>
<iframe src={url.replace('#{ticketId}', ticketId)} style="border: 0; width: 100%; height: 100%"/>