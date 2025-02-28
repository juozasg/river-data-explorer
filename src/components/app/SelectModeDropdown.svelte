<div>
	<span>I want to compare monitoring site(s): </span>
	<select>
		<option value="1">Select a site on the map</option>
		<option value="2">All sites for a river </option>
		<option value="2">Data 2 site (sjrbc-15) </option>
		<option value="2" disabled>All sites in Data 2 catchment area</option>
		<option value="2">Draw shape to select sites</option>
	</select>
</div>

<div>
	<span>I want to compare a catchment area: </span>
	<select>
		<option value="1" disabled>Catchment for Data 1 selected site</option>
		<option value="1">Catchment for currently selected site (sjrbc-15)</option>
		<option value="2">Catchment for a river</option>
		<option value="2">Custom catchment for any point</option>
		<option value="2">Draw a custom area</option>
		<option value="2">Entire basin (HUC8)</option>
		<option value="2">Hydrological Unit River (HUC10)</option>
		<option value="2">Hydrological Unit Stream (HUC12)</option>
		<option value="2">County</option>
		<option value="2">Indiana</option>
		<option value="2">Michigan</option>
	</select>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		span {
			display: block;
			margin-top: 1rem;
			margin-bottom: 1rem;
			font-size: 1.5rem;
		}

		select {
			display: block;
			padding-left: 1rem;

			font-size: 1.5rem;
			margin-left: 1rem;
			width: 90%;
		}
	}
</style>
