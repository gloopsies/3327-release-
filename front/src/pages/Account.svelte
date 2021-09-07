<script lang="ts">
    import { onDestroy } from "svelte";

    import { loggedIn, login } from "../libs/auth";
    import { getWallet, isOrganization } from "../libs/blockchain";
    import { account, modal_component, modal_open } from "../libs/stores";
    import type { User } from "../libs/types";
    import Details from "../components/pages/Account/Details.svelte";
    import Tabbed from "../components/atoms/Tabbed.svelte";
    import Awards from "../components/pages/Account/Awards.svelte";
    import Donations from "../components/pages/Account/Donations.svelte";
    import { modals } from "../libs/imports";

    export let selected: number = 0;

    const tabs = [
        {
            title: "Donations",
            component: Donations,
            click: () => {
                window.history.pushState(null, "Donations", "/account/donations");
                selected = 0;
            },
        },
        {
            title: "Awards",
            component: Awards,
            click: () => {
                window.history.pushState(null, "Donations", "/account/awards");
                selected = 1;
            },
        },
    ];

    const open_modal = () => {
        modal_open.update(e => !e);
        modal_component.set(modals.request);
    };

    let acc: User;
    const account_unsubscribe = account.subscribe((account: User) => acc = account);
    onDestroy(() => account_unsubscribe());

</script>

{#await loggedIn()}

    <h2>Loading...</h2>

{:then _ }

    {#if !acc.session}
        <div class="log-in">
            <div>
                <h1>Sign into your wallet</h1>
                <p>To get notifications and fancy display name feel free to create a free account</p>
                <img src="/images/metamask-fox.svg" alt="metamask">
                <button on:click={async () => login(await getWallet())}>
                    Log in
                </button>
            </div>
        </div>
    {:else}
        <div class="wrapper">
            <Details />
            <Tabbed {tabs} {selected} fill />
            <div class="spacer"></div>
            {#await isOrganization(acc.wallet) then is}
                {#if !is}
                    <p class="request">To create a fundraiser <span class="modal" on:click={open_modal}>request to become an Organization</span>
                    </p>
                {/if}
            {/await}
        </div>
    {/if}

{:catch err}

    {err}

{/await}

<style lang="scss">
  @use '../scss/index' as imports;

  .modal {
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      filter: brightness(.8);
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    position: absolute;
    inset: 16px;
  }

  .spacer {
    flex-grow: 1;
  }

  .log-in {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;

    div {
      display: flex;
      flex-direction: column;
      align-items: center;

      h1 {
        padding: 16px;
      }

      img {
        width: 300px;
        max-width: 90%;
      }

      button {
        font-size: 2rem;
        background-color: imports.$alt-color;
        color: black;
        border: none;
        padding: 16px;
        border-radius: imports.$border-radius;
        cursor: pointer;
        box-shadow: 3px 3px 6px rgba(0, 0, 0, .4);

        &:hover {
          background-color: darken(desaturate(imports.$alt-color, 30%), 10%);
        }
      }
    }
  }
</style>