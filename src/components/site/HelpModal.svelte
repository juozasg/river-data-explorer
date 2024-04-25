
<script lang="ts">
	type Props = { closeFn: () => void }
	let { closeFn }: Props  = $props();

	const closeOnEscape = (e: { key: string; }) => {if(e.key === 'Escape') closeFn()};
</script>


<svelte:document onkeydown={closeOnEscape} />

<div class="modal is-active">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-background"
	onclick={closeFn}></div>

	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">How to use this site?</p>
			<button class="delete"
			onclick={closeFn}
			aria-label="close"></button>
		</header>

		<section class="modal-card-body">
			<div class="content">
				<div style="margin-bottom: 1rem">
					<strong>Press <kbd>H</kbd> key to show and hide help</strong>
				</div>



				<h3>Overview</h3>
					<p>This site was created by the <a href="https://sjrbc.com">St. Joseph River Basin Commission</a> to share its river water data collected in the Basin with the public. Here you can explore, visualize, analyze and download all of the currently collected data. The website can be used to learn more about the Basin, its regions, and the variables that are being monitored. Monitoring sites are mapped. Observations for multiple sites or regions can be compared to track changes over time and to answer questions about the health of the St. Joseph and the Basin.</p>

					The site is designed to be user-friendly and intuitive, but if you need help, you can always press the <kbd>H</kbd> key to see this help.

				<h3>Site Sections</h3>

				<p>
					The menu bar at the top of the page is used to navigate the site.
						The <a onclick={closeFn} href="/">Home</a> and <a onclick={closeFn} href="/about">About</a> pages are the starting points.
						The <a onclick={closeFn} href="/regions">Regions</a> sub-menu is used to reach information for sub-regions of the Basin, while the <a onclick={closeFn} href="/variables">Variables</a> sub-menu links to pages for the measured variables. Finally the <a href="/visualize">Visualize</a> page provides web-based tools for mapping, comparing and analyzing the regional and site variables over time.
				</p>

				<h3>The Web Map</h3>
				<p>The web map has a 3D mode toggled by the "Compass" icon. At the bottom right of the map the base layers can be switched between topographical map and satellite imagery. TODO: River stem and water bodies can be highlighted by toggling the "River Outline" overlay</p>


				<h3>Common Tasks</h3>
				<p>TODO: Switching variables. Selecting regions, variables and site. Showing and selecting coverage data. Scrolling timeseries</p>

				<h3>Using the Regions Pages</h3>
				<p>TODO: ...</p>

				<h3>Using the Variables Pages</h3>
				<p>TODO: ...</p>

				<h3>Visualing and Comparing Sites and Regions</h3>
				<p>TODO: ...</p>



			</div>
		</section>
	</div>
</div>


<style lang="scss">
	.modal-card-title {
		font-size: 1.8rem;
		font-weight: 600;
	}
</style>