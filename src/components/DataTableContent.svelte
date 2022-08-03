<script lang="ts">
  import { getSite, selectedSites, selectedSeries, mapStore } from '../lib/stores';
  import { model } from '../lib/data/model';
  import List, { Item, Separator, Text, PrimaryText, SecondaryText } from '@smui/list';
  import { get } from 'svelte/store';


  function value(siteId: string, selectedSeries) {
    const val = model.getValue(siteId, selectedSeries);
    if(val === undefined) {
      return 'n/a';
    }

    return val;
  }

  function valueDate(siteId: string, selectedSeries) {
    const val = model.getValue(siteId, selectedSeries);
    if(val === undefined) {
      return 'n/a';
    }

    return new Date(model.getValueDate(siteId, selectedSeries)).toISOString().slice(0,10);
  }

  function centerMapOn(siteId: string) {
    const site = getSite(siteId);
    // console.log('center ', site.lat, site.lon);
    let offset = -0.05;
    if(window.innerWidth < 1024) {
      offset = -0.065;
    }
    get(mapStore).setView([site.lat, site.lon + offset], 12);;
  }
</script>


<div id='data-table-content'>

  <h2>Data Table</h2>
  <h3>{$selectedSeries} for {$selectedSites.size} site(s) selected</h3>
  <List threeLine nonInteractive>
    {#each Array.from($selectedSites).reverse() as siteId}
      <Separator/>
      <Item>
        <Text>
          <!-- svelte-ignore a11y-invalid-attribute -->
          <PrimaryText><a href="#" on:click={() => centerMapOn(siteId)}>{siteId}</a></PrimaryText>
          <SecondaryText>{getSite(siteId).name}</SecondaryText>
          <SecondaryText>{valueDate(siteId, $selectedSeries)}: {value(siteId, $selectedSeries)}</SecondaryText>
        </Text>
      </Item>
    {/each}

  </List>
</div>

<style lang="scss">
  #data-table-content {
    padding: 0 0.5rem 0.5rem 1rem;
    h3 {
      margin: 0.5rem 0;
    }
  }
</style>