<script lang="ts">
</script>

{#snippet item(label, id)}
<li class:is-active={id === 'huc10'} id="region-tab-{id}">
  <a>
    <span>{label}</span>
  </a>
</li>
{/snippet}

<div class="tabs is-toggle is-centered">
  <ul>
    {@render item('Stream (HUC12)', 'huc12')}
    {@render item('River (HUC10)', 'huc10')}
    {@render item('County', 'county')}
    {@render item('State', 'state')}
    {@render item('Basin (HUC8)', 'basin')}
    {@render item('Custom Area...', 'custom')}
  </ul>
</div>
