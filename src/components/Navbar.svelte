<script lang="ts">
    const getVariableRoutes = async () => {
        const response = await fetch(`/api/variables`);
        return await response.json();
    }
</script>


<nav class="navbar is-fixed-top is-transparent" aria-label="main navigation">
	<div class="navbar-brand">
		<a href="#!" role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
		</a>
	</div>

	<div id="navbarBasicExample" class="navbar-menu">
		<div class="navbar-start">
			<a href="/" class="navbar-item is-active is-underlined has-text-weight-semibold">
				Home
			</a>

			<a href="/about" class="navbar-item">
				About
			</a>

			<div class="navbar-item has-dropdown is-hoverable">
				<a href="#!" class="navbar-link">
					Regions
				</a>
				<div class="navbar-dropdown is-boxed">
					<a href="/regions/huc01" class="navbar-item">
						Huc01
					</a>
					<a href="/regions/huc02" class="navbar-item">
						Huc02
					</a>
				</div>
			</div>

			<div class="navbar-item has-dropdown is-hoverable">
				<a href="#!" class="navbar-link">
					Variables
				</a>
				<div class="navbar-dropdown is-boxed">
					<a href="/variables/ph" class="navbar-item">
						pH
					</a>
					<a href="/variables/fishIbi" class="navbar-item">
						Fish IBI
					</a>
					<a href="/variables/do" class="navbar-item">
						Dissolved Oxygen
					</a>
				</div>
			</div>
		</div>
	</div>
</nav>

