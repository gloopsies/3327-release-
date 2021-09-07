<script lang="ts">
    import type { Currency } from "../../libs/types";

    export let id: string = null, currencies: Currency[], selected: Currency;

    const close = () => opened = false;

    let opened = false;
</script>

<div class="dropdown">
    {#if typeof selected !== "undefined"}
        <button {id} on:click={() => opened = !opened}>
            <i class={`cf ${selected.iconClass}`}></i>
            {selected.name}
        </button>
    {/if}
    {#if opened}
        <div class="menu">
            <ul>
                {#each currencies as currency}
                    <li on:click={() => {selected = currency; close()}}>
                        <i class={`cf ${currency.iconClass}`}></i>
                        {currency.name}
                    </li>
                {/each}
            </ul>
        </div>
        <div class="close" on:click={close}></div>
    {/if}
</div>

<style lang="scss">
  @use '../../scss/index' as imports;

  button {
    color: black;
    display: flex;
    align-items: center;
    padding: .1rem .3rem;
    gap: .2rem;
  }

  i {
    color: black;
    font-size: 2rem;
  }

  .dropdown {
    position: relative;
  }

  .menu {
    position: absolute;
    top: 0;
    background-color: white;
    border-radius: imports.$border-radius;
    overflow: hidden;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, .4);
    z-index: 100;
    max-height: 250px;
    overflow-y: auto;

    li {
      list-style: none;
      color: black;
      display: flex;
      align-items: center;
      gap: .2rem;
      cursor: pointer;
      padding: .4rem calc(.2rem + 24px) .4rem .2rem;

      &:hover {
        background-color: darken(white, 20%);
      }
    }
  }

  .close {
    position: fixed;
    inset: 0;
  }
</style>