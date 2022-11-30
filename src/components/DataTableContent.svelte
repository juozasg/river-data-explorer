<script lang="ts">
  import { fly, slide } from 'svelte/transition';
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
  import List, { Item, Separator, Text, PrimaryText, SecondaryText } from '@smui/list';
  import Tab, { Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
 

  import { getSite, selectedSites, selectedSeries, mapStore } from '../lib/stores';
  import { model } from '../lib/data/model';
  import { labels, units } from '../lib/definitions';
  import { get } from 'svelte/store';

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

  function valueDate(siteId: string, selectedSeries) {
    const val = model.getValue(siteId, selectedSeries);
    if(val === undefined) {
      return 'n/a';
    }

    const isoDate = new Date(model.getValueDate(siteId, selectedSeries)).toISOString();

    return (isoDate.slice(0, 10) + ' ' + isoDate.slice(11, 16));
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

  let active = 'All';
</script>


<div id='data-table-content'>
  <h2>Data Table</h2>
  <Separator/>
  <TabBar tabs={['Selected', 'All', 'Statistics']} let:tab bind:active>
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
            <!-- svelte-ignore a11y-missing-attribute -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <PrimaryText><a class="pointer" on:click={() => centerMapOn(siteId)}>{siteId}</a></PrimaryText>
            <SecondaryText>{getSite(siteId).name}</SecondaryText>
            {#if $selectedSeries === 'datainfo' || valueUndefined(siteId, selectedSeries)}
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

  {#if active === 'All'}
    {#each Array.from($selectedSites).reverse() as siteId}
      <div transition:slide>
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <PrimaryText><a class="pointer" on:click={() => centerMapOn(siteId)}>{siteId}</a></PrimaryText>
        <SecondaryText>{getSite(siteId).name}</SecondaryText>

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

  <DataTable table$aria-label="People list" style="max-width: 100%;">
    <Head>
      <Row>
        <Cell>Name</Cell>
        <Cell>Favorite Color</Cell>
        <Cell numeric>Favorite Number</Cell>
      </Row>
    </Head>
    <Body>
      <Row>
        <Cell>Steve</Cell>
        <Cell>Red</Cell>
        <Cell numeric>45</Cell>
      </Row>
      <Row>
        <Cell>Sharon</Cell>
        <Cell>Purple</Cell>
        <Cell numeric>5</Cell>
      </Row>
      <Row>
        <Cell>Rodney</Cell>
        <Cell>Orange</Cell>
        <Cell numeric>32</Cell>
      </Row>
      <Row>
        <Cell>Mack</Cell>
        <Cell>Blue</Cell>
        <Cell numeric>12</Cell>
      </Row>
    </Body>
  </DataTable>
   

  {/if}


  
</div>

<style lang="scss">
  #data-table-content {
    padding: 0 0.5rem 0.5rem 1rem;
    h3 {
      margin: 0.5rem 0;
    }

    a.pointer {
      cursor: pointer;
    }
  }
</style>