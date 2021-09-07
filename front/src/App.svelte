<script lang="ts">
    import { Router } from "svelte-navigator";

    import Navigation from "./components/layouts/Navigation.svelte";
    import Footer from "./components/layouts/Footer.svelte";
    import Modal from "./components/modals/Modal.svelte";

    import Routes from "./Routes.svelte";
    import { logOut } from "./libs/auth";
    import Notification from "./components/atoms/Notification.svelte";
    import { has_provider } from "./libs/web3";
    import Loading from "./components/atoms/Loading.svelte";

    if (has_provider()) {
        // @ts-ignore
        window.ethereum.on("accountsChanged", () => logOut());
        // @ts-ignore
        window.ethereum.on("chainChanged", () => window.location.reload());
    }
</script>

<Router primary={false}>
    <Navigation />
    <div class="wrapper">
        <main>
            <Routes />
        </main>
        <Footer />
    </div>
    <Modal />
    <Notification />
    <Loading />
</Router>


<style lang="scss">
  @use "scss/index" as imports;

  .wrapper {
    margin-left: imports.$sidebar-closed-width;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    position: relative;
    padding: 16px;
    flex-grow: 1;
  }

  :global(body) {
    background-color: imports.$bg-color;
    font-family: 'Red Hat Display', sans-serif;
    color: imports.$fg-color;
  }

  :global(::selection) {
    background-color: imports.$alt-color;
    color: black;
  }

  :global(a) {
    color: imports.$alt-color;
  }

  :global(*) {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
</style>