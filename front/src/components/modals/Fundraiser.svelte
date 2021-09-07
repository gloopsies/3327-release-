<script lang="ts">
    import Meter from "../atoms/Meter.svelte";
    import Card from "../atoms/Card.svelte";
    import { onDestroy } from "svelte";
    import { loader, modal_fundraiser, notification } from "../../libs/stores";
    import { loggedIn } from "../../libs/auth";
    import CurrencyPicker from "../atoms/CurrencyPicker.svelte";
    import InputConverter from "./Fundraiser/InputConverter.svelte";
    import { currencies, fromWei, toWei } from "../../libs/imports";
    import { currencySwap, donate, getWallet } from "../../libs/blockchain";
    import type { Fundraiser } from "../../libs/types";
    import { NotificationType } from "../../libs/types";


    let fundraiser: Fundraiser = {} as Fundraiser;
    let unsubscribe = modal_fundraiser.subscribe(val => fundraiser = val);

    let currency = currencies[0];

    let amount = 0n;

    const funcIn = async e => {
        return fromWei(await currencySwap(fundraiser.currency, currency, e), currency);
    };
    const funcOut = async e => {
        return currencySwap(currency, fundraiser.currency, toWei(e, currency));
    };

    const donate_click = async () => {
        try {
            $loader = "Donation in progress...";
            await donate(await getWallet(), fundraiser, `${amount}`, currency);
            $notification = {
                type: NotificationType.success,
                message: "Successfully donated",
            };
        } catch (e: Error) {
            $notification = {
                type: NotificationType.error,
                message: e.message,
            };
        } finally {
            $loader = null;
        }
    };

    onDestroy(() => unsubscribe());
</script>

<Card>
    <div class="wrapper grid">
        <h1>{fundraiser.name} <span class="category">({fundraiser.category})</span></h1>
        <img
            alt={fundraiser.image}
            src={fundraiser.image}
        />
        <span class="description">{fundraiser.description}</span>
        <div class="progress-bar">
            <span>
                <Meter bind:selected={amount} interactive={true} max={fundraiser.goal}
                       value={fundraiser.raisedAmount} />
            </span>
        </div>
        <h3>
            {fromWei(fundraiser.raisedAmount + amount, fundraiser.currency)}
            / {fromWei(fundraiser.goal, fundraiser.currency)} {fundraiser.currency.name}
            | {fundraiser.days_left !== 1 ? `${fundraiser.days_left} days` : `${fundraiser.days_left} day`} left
        </h3>
    </div>
</Card>
<div class="gap"></div>
<Card>
    {#await loggedIn() then logged}
        <div class="wrapper">
            {#if logged}
                <div class="row">
                    <InputConverter bind:input={amount} bind:currency {funcOut} {funcIn}
                                    max={fundraiser.goal - fundraiser.raisedAmount} />
                    <CurrencyPicker currencies={currencies} bind:selected={currency} />
                    <div class="spacer"></div>
                    <button on:click={donate_click}>Donate</button>
                </div>
            {:else}
                Please log into your blockchain account to continue. You can do so at your <a href="/account">account
                page.</a>
            {/if}
        </div>
    {:catch err}
        {err}
    {/await}
</Card>

<style lang="scss">
  @use '../../scss/index' as imports;

  * {
    color: imports.$card-color;
  }

  .spacer {
    flex-grow: 1;
  }

  .wrapper {
    width: calc(100vw - 64px);
    max-width: 800px;
  }

  .gap {
    height: 16px;
  }

  .grid {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 16px;
    max-height: 70vh;
    overflow-y: auto;

    img {
      width: 100%;
      aspect-ratio: 1;
      border-radius: imports.$border-radius;
      object-fit: cover;
    }

    & > :not(img, span) {
      grid-column: 1/3;
    }
  }

  h1 {
    font-size: 1.6em;
    color: imports.$card-color;
  }

  h1, h3 {
    text-align: center;
  }

  .category {
    color: rgb(85, 85, 85);
  }

  .description {
    text-indent: 2rem;
  }

  .progress-bar {
    display: flex;
    justify-content: center;
    padding: 0 16px;

    span {
      flex-grow: 1;
      max-width: 500px;
    }
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  @media (max-width: 800px) {
    .grid {
      grid-template-columns: 1fr;

      img {
        justify-self: center;
        width: 100%;
        max-width: 250px;
      }

      * {
        grid-column: 1/2;
      }
    }
  }

  button {
    color: black;
    padding: .1rem .3rem;
  }
</style>