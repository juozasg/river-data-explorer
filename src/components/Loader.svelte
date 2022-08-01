<script lang="ts">
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import LinearProgress from '@smui/linear-progress';

  import { loadUSGS } from "../lib/data/usgsLoader";

  let open = true;

</script>


{#if false}
<div class="loader">
  <Dialog
  bind:open
  aria-labelledby="loader-title"
  aria-describedby="loader-content"
>

    <Title id="loader-title">Loading Data</Title>
    {#await loadUSGS()}
      <Content id="loader-content">
        Loading USGS Data
        <LinearProgress indeterminate />

      </Content>
    {:then}
      <Content id="loader-content">USGS Loaded!</Content>
    {:catch error}
      <Content id="loader-content">Loading USGS Data Error:
        <p style="color: red">{error.message}</p>
      </Content>
    {/await}

    <Actions>
      <Button action="accept">
        <Label>Close</Label>
      </Button>
    </Actions>
  </Dialog>
</div>

{/if}