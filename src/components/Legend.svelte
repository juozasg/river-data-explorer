<!-- <img src='mockup.png' alt='legand mockup' width='300px'/> -->
<script lang="ts">
  import type { ColorScale } from '../types';

  import { selectedSeries } from '../lib/stores';
  import { colorbarSvg } from '../lib/legend/colorbar';
  import { scales } from '../lib/definitions';
  import { radiusListSvg, measurementFrequencyRadiusListSvg } from '../lib/legend/radius';
  import Tooltip, { Wrapper } from '@smui/tooltip';

  let scale: ColorScale;

  $: scale = scales[$selectedSeries];
</script>

<div id='legend' class='legend-{$selectedSeries}'>
  {@html colorbarSvg(scale).outerHTML}

  {#if $selectedSeries === 'datainfo' }
    <Wrapper>
      {@html measurementFrequencyRadiusListSvg(scale).outerHTML}
      <Tooltip>Yearly, Monthly, Weekly, Daily, Real-Time</Tooltip>
    </Wrapper>
  {:else}
    {@html radiusListSvg(scale).outerHTML}
  {/if}
</div>

<style lang="scss">
  #legend {
    padding-top: 1rem;
    width: 300;
    margin-left: 30px;
    margin-top: 10px;
  }

  .legend-datainfo {
    margin-top: 0 !important;
  }

</style>