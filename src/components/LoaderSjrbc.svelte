<script lang="ts">
  import { Content } from '@smui/dialog';
  import LinearProgress from '@smui/linear-progress';

  import { loadSJRBC } from "../lib/data/loaderSjrbc";
</script>



{#await loadSJRBC()}
  <Content id="loader-content">
    Loading SJRBC Data
    <LinearProgress indeterminate />
  </Content>
{:then}
  <Content id="loader-content">SJRBC Loaded!</Content>
{:catch error}
  <Content id="loader-content">Loading SJRBC Data Error:
    <p style="color: red">{error.message}</p>
  </Content>
{/await}
