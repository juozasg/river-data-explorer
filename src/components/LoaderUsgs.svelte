<script lang="ts">
  import { Content } from '@smui/dialog';
  import LinearProgress from '@smui/linear-progress';

  import { loadUSGS } from "../lib/data/loaderUsgs";
</script>


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
