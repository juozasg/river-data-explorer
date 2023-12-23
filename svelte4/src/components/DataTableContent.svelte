<script lang="ts">
  
  import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
  import List, { Item, SecondaryText, Separator, Text } from '@smui/list';
  import Tab, { Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
  import { slide } from 'svelte/transition';
 

  import { get } from 'svelte/store';
  import { model } from '../lib/data/model';
  import { formatValueMean, labels, units } from '../lib/definitions';
  import { getSite, mapStore, selectedSeries, selectedSites } from '../lib/stores';
  import DataTableSiteHeader from './DataTableSiteHeader.svelte';

  function valueUndefined(site, series) {
    return model.getValue(site, series) === undefined;
  }

  function valueWithUnits(siteId: string, selectedSeries) {
    const val = model.getValue(siteId, selectedSeries);
    console.log(val);
    
    if(val === undefined) {
      return 'n/a';
    }

    const u = units[selectedSeries] || '';

    return u.length > 0 ? val + ` ${u}` : val;
  }

  function niceDate(date: Date, short = false) {
    const isoDate = date.toISOString();

    if(short) {
      return isoDate.slice(0, 10); 
      // return `${date.getFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}`;
    }
    return (isoDate.slice(0, 10) + ' ' + isoDate.slice(11, 16));
  }




  function valueDate(siteId: string, selectedSeries) {
    const val = model.getValue(siteId, selectedSeries);
    if(val === undefined) {
      return 'n/a';
    }

    return niceDate(new Date(model.getValueDate(siteId, selectedSeries)));

  }

  function observationsSummary(siteId: string) {
    const index = model.getDframe(siteId).getIndex();
    const arr = index.toArray();

    const first = niceDate(new Date(arr[0]), true);
    const last = niceDate(new Date(index.last()), true);


    const count = arr.length;

    return `${count} observations ${first} to ${last}`;
  
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

  let active = 'Selected';
</script>


<div id='data-table-content'>
  <h2>Data Table</h2>
  <Separator/>
  <TabBar tabs={['Selected', 'Last', 'Statistics']} let:tab bind:active>
    <Tab {tab} minWidth>
      <Label>{tab}</Label>
    </Tab>
  </TabBar>

  {#if active === 'Selected'}
    <h3>{$selectedSites.size} site(s) selected</h3>
    <h3>{labels[$selectedSeries]}:</h3>
    <List threeLine nonInteractive >
      {#each Array.from($selectedSites).reverse() as siteId}
      <div transition:slide>
        <Item>
          <Text>
            <DataTableSiteHeader siteId={siteId}/>
            {#if $selectedSeries === 'datainfo' || valueUndefined(siteId, $selectedSeries)}
              <SecondaryText><b>{valueWithUnits(siteId, $selectedSeries)}</b></SecondaryText>
            {:else}
              <SecondaryText>{valueDate(siteId, $selectedSeries)}: <b>{valueWithUnits(siteId, $selectedSeries)}</b></SecondaryText>
            {/if}
          </Text>
        </Item>
      </div>
      {/each}

    </List>
  {/if}

  {#if active === 'Last'}
    {#each Array.from($selectedSites).reverse() as siteId}
      <div transition:slide>
        <DataTableSiteHeader siteId={siteId}/>

        {#each Object.keys(labels) as k}
          {#if k === 'datainfo'}
            <SecondaryText><b>{valueWithUnits(siteId, k)}</b></SecondaryText>
          {:else if !valueUndefined(siteId, k)}
            <SecondaryText>{labels[k]}: <b>{valueWithUnits(siteId, k)}</b></SecondaryText>
          {/if}
        {/each}
      </div>
      <hr/>

    {/each}

  {/if}


  {#if active === 'Statistics'}
  {#each Array.from($selectedSites).reverse() as siteId}
    <div transition:slide>
      <DataTableSiteHeader siteId={siteId}/>
      <SecondaryText>{observationsSummary(siteId)}</SecondaryText>

      <DataTable table$aria-label="People list" style="max-width: 100%;">
        <Head>
          <Row>
            <Cell>Series</Cell>
            <Cell numeric># obs</Cell>
            <Cell numeric>Min</Cell>
            <Cell numeric>Max</Cell>
            <Cell numeric>Mean</Cell>
          </Row>
        </Head>
        <Body>
          {#each Object.keys(labels) as k}
            {#if k !== 'datainfo' && !valueUndefined(siteId, k)}
            <Row>
              <Cell>{k}</Cell>
              <Cell numeric>{model.getSeries(siteId, k).toArray().length}</Cell>
              <Cell numeric>{model.getSeries(siteId, k).min()}</Cell>
              <Cell numeric>{model.getSeries(siteId, k).max()}</Cell>
              <Cell numeric>{formatValueMean(siteId, k)}</Cell>
            </Row>
            {/if}
          {/each}

        </Body>
      </DataTable>
    </div>
  {/each}

  {/if}

  <div class='github-links'>
    Data [<a href="https://github.com/Limnogirl90/SJRBC-web-map-data/archive/refs/heads/main.zip">ZIP</a>] [<a href="https://github.com/Limnogirl90/SJRBC-web-map-data/">GitHub</a>]
  </div>
  
</div>

<style lang="scss">
  #data-table-content {
    padding: 0 0.5rem 0.5rem 1rem;
    h3 {
      margin: 0.5rem 0;
    }

    div.github-links {
      margin-top: 1rem;
    }
  }

  :global(th), :global(td) {
    padding-left: 5px !important;
  }

  :global(th) {
    font-weight: bold !important;
  }
</style>