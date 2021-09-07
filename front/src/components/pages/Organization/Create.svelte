<script lang="ts">
    import { createCampaign, getWallet } from "../../../libs/blockchain";
    import { categories, currencies, modals, toWei } from "../../../libs/imports";
    import { Currency } from "../../../libs/types";
    import { modal_component, modal_currencies, modal_open } from "../../../libs/stores";

    let name: string;
    let description: string;
    let goal: string;
    let end: Date;
    let beneficiary: string;
    let currency = currencies[0];
    let category: string;
    let image: HTMLInputElement;

    const choose = async (): Promise<Currency> => {
        $modal_open = true;
        $modal_component = modals.currency;
        $modal_currencies = currencies;

        return new Promise<Currency>(resolve => {
            window.addEventListener("currency_picked", (e: CustomEvent) => {
                resolve(e.detail);
            }, { once: true });
        });
    };

    const create = async () => {
        await createCampaign(
            await getWallet(),
            name,
            description,
            toWei(goal, currency),
            Math.round((new Date(end)).getTime() / 1000),
            beneficiary,
            currency.address,
            category,
            image.files[0],
        );
    };
</script>


<div class="wrapper">
    <h1>Create fundraiser</h1>
    <label for="name">Name</label>
    <input type="text" name="name" id="name" placeholder="name" bind:value={name}>

    <label for="beneficiary">Beneficiary</label>
    <input type="text" name="beneficiary" id="beneficiary" placeholder="beneficiary"
           bind:value={beneficiary}>

    <label for="end_date">End date</label>
    <input type="date" name="end_date" id="end_date" bind:value={end}>

    <label for="goal">Goal</label>
    <input type="text" name="goal" id="goal" placeholder="goal" bind:value={goal}>


    <label for="currency">Currency:</label>
    <button  class="currency" id="currency" on:click={async () => currency = await choose()}>
        {currency !== null ? currency.name : "Select"}
    </button>

    <label for="category">Category</label>
    <select name="category" id="category" bind:value={category}>
        {#each categories as category}
            <option value={category}>{category}</option>
        {/each}
    </select>

    <label for="description">Description</label>
    <textarea name="description" id="description" cols="30" rows="10"
              bind:value={description}></textarea>

    <label for="image">Image</label>
    <input type="file" name="image" id="image" bind:this={image}>
    <button class="primary" on:click={create}>Create</button>
    <img src="/images/typewriter.svg" alt="">
</div>

<style lang="scss">
  @use '../../../scss/index' as imports;

  .wrapper {
    padding: 32px;
    max-width: 400px;
  }

  * {
    display: block;
  }

  label {
    font-size: 1.2em;
    margin-top: 12px;
    display: block;
    &[for="currency"] {
      display: inline-block;
      margin-right: .75rem;
    }
  }

  input, textarea, select {
    background: none;
    border: none;
    border-bottom: white 1px solid;
    color: white;
    padding: 6px;
    width: 100%;
  }

  .primary {
    @include imports.button-reset;
    @include imports.call-to-action;
  }

  .currency {
    @include imports.button-reset;
    color: imports.$fg-color;
    border: 1px white solid;
    padding: .3rem .6rem;
    border-radius: 4px;
    font-size: 1rem;
    display: inline-block;
  }

  img {
    position: absolute;
    right: 32px;
    bottom: 32px;
    width: 900px;
  }

</style>