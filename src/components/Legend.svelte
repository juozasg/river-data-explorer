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
    <div>
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
</div>

<style lang="scss">
  #legend {
    // margin-left: 30px;
    // margin-top: 2rem;
    display: flex;
    justify-content: center;
  }

  .legend-datainfo {
    margin-top: 1.5rem !important;
  }

</style>