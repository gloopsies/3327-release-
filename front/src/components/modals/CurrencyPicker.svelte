<script lang="ts">
    import Card from "../atoms/Card.svelte";
    import { modal_currencies, modal_open } from "../../libs/stores";
    import type { Currency } from "../../libs/types";

    let search: string = "";

    const set_currency = (currency: Currency) => {
        $modal_open = false;
        window.dispatchEvent(new CustomEvent("currency_picked", { detail: currency }));
    };

    const search_changed = (search: string) => $modal_currencies.filter((currency: Currency) => {
        return !(search.length !== 0 && currency.name.toLowerCase().indexOf(search.toLowerCase()) === -1);
    });

    let filtered: Currency[];

    $: filtered = search_changed(search);

</script>

<Card>
    <h2>Pick currency</h2>
    <input bind:value={search} placeholder="search" type="text">
    <div class="currencies">
        {#each filtered as currency}
            <button on:click={() => set_currency(currency)}>
                {currency.name}
            </button>
        {/each}
    </div>
</Card>

<style lang="scss">
  @use "../../scss" as imports;

  .currencies {
    width: 300px;
    height: 400px;
    max-height: 90%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    gap: .5rem;
  }

  @include imports.input-text-reset;

  input[type="text"] {
    width: calc(100% - 1rem);
    font-size: 1.2rem;
    padding: .2rem 0;
    margin: .5rem;
    border-bottom: 2px black solid;
  }

  button {
    @include imports.button-reset;
    display: block;
    width: 100%;
    background-color: darken(white, 10%);
    font-size: 1.2rem;
    padding: .5rem;
    border-radius: imports.$border-radius;

    &:disabled {
      background-color: imports.$bg-color-alt;
      color: imports.$fg-color;
    }

    &:not(:disabled):is(:hover, :focus), {
      outline: none;
      background-color: darken(white, 20%);
    }

  }
</style>