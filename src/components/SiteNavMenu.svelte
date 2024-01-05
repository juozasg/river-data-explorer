<script lang="ts">
    const getVariableRoutes = async () => {
        const response = await fetch(`/api/variables`);
        return await response.json();
    }
</script>

<div class="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
  <ul class="pure-menu-list">
      <li class="pure-menu-item pure-menu-selected">
          <a href="/" class="pure-menu-link">Home</a>
      </li>
      <li class="pure-menu-item">
          <a href="/about" class="pure-menu-link">About</a>
      </li>
      <li class="pure-menu-item">
          <a href="/grades" class="pure-menu-link">Grades</a>
      </li>
      <li class="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
          <a id="menu-link-regions" class="pure-menu-link">Regions</a>
          <ul class="pure-menu-children">
              <li class="pure-menu-item">
                  <a href="/regions/huc01" class="pure-menu-link">Huc01</a>
              </li>
              <li class="pure-menu-item">
                  <a href="/regions/huc02" class="pure-menu-link">Huc02</a>
              </li>
          </ul>
      </li>
      <li class="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
          <a href="#!" id="menu-link-variables" class="pure-menu-link">Variables</a>
          <ul class="pure-menu-children">
              <li class="pure-menu-item">
                  <a href="/variables/ph" class="pure-menu-link">pH</a>
              </li>
              <li class="pure-menu-item">
                  <a href="/variables/do" class="pure-menu-link">Dissolved Oxygen</a>
              </li>
              <li class="pure-menu-item">
                  <a href="/variables/fishIbi" class="pure-menu-link">Fish IBI</a>
              </li>
          </ul>
      </li>
  </ul>
</div>