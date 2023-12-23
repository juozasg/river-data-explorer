<script lang="ts">
    import { PrimaryText, SecondaryText } from "@smui/list";
    import { get } from "svelte/store";
    import { model } from "../lib/data/model";
    import { getSite, mapStore } from "../lib/stores";

    export let siteId: string;
    

    function centerMapOn(siteId: string) {
        const site = getSite(siteId);
        // console.log('center ', site.lat, site.lon);
        let offset = -0.05;
        if(window.innerWidth < 1024) {
        offset = -0.065;
        }
        get(mapStore).setView([site.lat, site.lon + offset], 12);;
    }

    function downloadCsv(siteId: string) {
        const element = document.createElement('a');
        let dframe = model.getDframe(siteId);
        dframe = dframe.transformSeries({
            date: date => {const d = new Date(date); return d.toISOString()},
        });
        const text = dframe.toCSV();
        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
        element.setAttribute('download', siteId + ".csv");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

</script>


<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<PrimaryText>
    <a class="pointer" on:click={() => centerMapOn(siteId)}>{siteId}</a>
    <span class='download'>[<a class="pointer" on:click={() => downloadCsv(siteId)}>CSV</a>]</span> 
</PrimaryText>
<SecondaryText>{getSite(siteId).name}</SecondaryText>

<style>
    a.pointer {
        cursor: pointer;
    }

    .download {
        font-size: 0.8em;
        color: #999;
    }
</style>
