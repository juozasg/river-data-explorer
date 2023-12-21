<script lang="ts">
  import Dialog, { Title, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';

  import LoaderUsgs from './LoaderUsgs.svelte';
  import LoaderSjrbc from './LoaderSjrbc.svelte';

  let open = true;
</script>


<div class="loader">
  <Dialog
  bind:open
  aria-labelledby="loader-title"
  aria-describedby="loader-content">
    <span class="version">version: 0.6.1</span>
    <Title id="loader-title">Loading Data</Title>

    <LoaderUsgs/>
    <LoaderSjrbc/>

    <Actions>
      <Button action="accept">
        <Label>Close</Label>
      </Button>
    </Actions>
  </Dialog>
</div>
