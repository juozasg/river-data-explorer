<script lang="ts">
</script>

<div class="basin-header">
	<!-- <h5 class='select-label'>Select</h5> -->
	<div class="select-choices">
		<a>Basin <small>HUC8</small></a>
		<a>State</a>
		<a>County</a>
		<a>River <small>HUC10</small></a>
		<a class="select-huc-12">Stream <small>HUC12</small></a>
	</div>
	<div class="selected-details">
		<strong>Brandywine Creek-Saint Joseph River</strong>
		<small>HUC10&nbsp;0405000122</small>
	</div>
</div>

<style>
	.basin-header {
		padding: 0 0rem;
		margin-bottom: 0.5rem;

		.select-label {
			margin-right: 1rem;
		}
		/* background-color: #f0f0f0; */
		/* padding: 1rem; */
		display: flex;
		justify-content: space-between;

		.select-huc-12 {
			border-right: none;
		}

		small {
			font-size: 70%;
		}

		.select-choices {
			/* flex-grow: 0; */
			display: flex;
			justify-content: space-between;
			gap: 10px;
			flex-grow: 1;

			& > a {
				* {
					display: block;
				}
				flex-grow: 1;
				/* margin: 0 3px; */
				/* padding-right: 6px; */
				/* border-right: 1px solid #ccc; */
			}
		}

		.selected-details {
			/* margin-left: auto; */
			/* flex-grow: 1; */
			flex-basis: content;
			text-align: right;
			padding-right: 0;
			padding-left: 1rem;
			margin-right: 0;
		}
	}
</style>
