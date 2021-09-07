<script lang="ts">
    import { Link } from "svelte-navigator";
</script>

<footer>
    <div>
        <h1>About</h1>
        <p>Support Children is a project created by Petar Radojević, Ivan Džambasanović and Branko Grbić as a part of
            web3.0 project for donation services.</p>
    </div>
    <div>
        <h1>Sitemap</h1>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/explore">Explore</Link>
            </li>
            <li>
                <Link to="/contact-us">Contact us</Link>
            </li>
        </ul>
    </div>
    <div>
        <p>This website is released to public under the MIT licence</p>
    </div>
</footer>

<style lang="scss">
  footer {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
    padding: 16px;
    background-color: black;
    color: white;

    h1, p {
      color: white;
    }

    ul {
      color: white;
      list-style: none;
    }

    :global(a) {
      color: white;
    }

    div:last-child {
      grid-column: 1 / 3;
    }
  }

  @media (max-width: 1000px) {
    footer {
      grid-template-columns: 1fr;

      div:last-child {
        grid-column: 1 / 2;
      }
    }
  }
</style>