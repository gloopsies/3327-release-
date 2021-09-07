<script lang="ts">
    import Card from "../atoms/Card.svelte";
    import env from "../../.env.ts";
    import { chainId, switchChain } from "../../libs/blockchain";
</script>

<Card>
    <h1>Switch network</h1>
    <div>
        {#each [...env.networks.values()] as network}
            <button
                on:click={() => switchChain(network.parameters.chainId)}
                disabled={chainId === network.parameters.chainId}
            >
                {network.parameters.chainName}
            </button>
        {/each}
    </div>
</Card>

<style lang="scss">
  @use "../../scss" as imports;

  div {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    width: 300px;
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

    &:not(:disabled):hover {
      background-color: darken(white, 20%);
    }
  }
</style>