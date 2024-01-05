<script lang="ts">
    const getVariableRoutes = async () => {
        const response = await fetch(`/api/variables`);
        return await response.json();
    }
</script>


<nav class="navbar is-fixed-top is-transparent" aria-label="main navigation">
	<div class="navbar-brand">
		<a class="navbar-item" href="/">
      <img src="/sjrbc-logo.png" alt="SJRBC Logo">
    </a>

		<a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
		</a>
	</div>

	<div class="navbar-menu">
		<div class="navbar-start">
			<a href="/" class="navbar-item is-active">
				Home
			</a>

			<a href="/about" class="navbar-item">
				About
			</a>

			<div class="navbar-item has-dropdown is-hoverable">
				<a class="navbar-link is-arrowless">
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
				<a class="navbar-link is-arrowless">
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

