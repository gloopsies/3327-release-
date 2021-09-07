<script lang="ts">
    import { modals } from "../libs/imports";
    import { modal_component, modal_open } from "../libs/stores";
    import { Link } from "svelte-navigator";

    const open_modal = (modal: modals) => {
        modal_open.update(e => !e);
        $modal_component = modal;
    };
</script>

<div class="page switch">
    <div class="wrapper">
        <h1>Switch network</h1>
        <p>
            Switching networks can help you switch to your best Ethereum solution for donation services.

            <br />
            <br />

            You can switch from Ethereum Mainnet to Polygon Layer 2 solution. 
            Layer 2 solutions provide you with increased scalability and lower-cost usage.
        </p>
        <button on:click={() => open_modal(modals.networks)}>Switch network</button>
        <p>You can learn more about it at <Link to="/guides">our guide</Link>. </p>
    </div>

    <img alt="home" src="/images/networks.svg">
</div>

<style lang="scss">
  @use "../scss" as imports;

  .page {
    @include imports.page;

    button {
      @include imports.button-reset;
      @include imports.call-to-action;
    }
  }

  .switch {
    .wrapper {
      left: 32px;
    }

    img {
      right: 0;
      padding-right: 5%;
    }
  }
</style>